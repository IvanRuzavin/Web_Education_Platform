const express = require("express");
const db = require("../db");

const router = express.Router();

const MAX_EVALUATION_POINTS = 3;
const REQUIRED_EVALUATIONS_PER_PROJECT = 2;

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const normalizeScore = (score) => {
  const value = Number(score);
  if (!Number.isFinite(value)) return null;
  return Math.min(100, Math.max(0, Math.round(value)));
};

router.get("/assigned/:uid", async (req, res) => {
  try {
    const rows = await all(
      `
      SELECT
        e.evaluation_id,
        e.project_id,
        e.evaluated_user_id,
        e.evaluator_user_id,
        e.status,
        e.score,
        e.feedback,
        e.created_at,
        e.completed_at,
        p.project_name,
        p.peripheral,
        p.image_url,
        u.name AS evaluated_name,
        u.surname AS evaluated_surname,
        u.avatar AS evaluated_avatar
      FROM Evaluations e
      JOIN Projects p ON p.project_id = e.project_id
      JOIN Users u ON u.uid = e.evaluated_user_id
      WHERE e.evaluator_user_id = ?
        AND e.status = 'pending'
      ORDER BY e.created_at ASC
      `,
      [req.params.uid]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/project/:project_id/:uid", async (req, res) => {
  try {
    const rows = await all(
      `
      SELECT
        e.evaluation_id,
        e.status,
        e.score,
        e.feedback,
        e.created_at,
        e.completed_at,
        evaluator.uid AS evaluator_uid,
        evaluator.name AS evaluator_name,
        evaluator.surname AS evaluator_surname,
        evaluator.avatar AS evaluator_avatar
      FROM Evaluations e
      JOIN Users evaluator ON evaluator.uid = e.evaluator_user_id
      WHERE e.project_id = ?
        AND e.evaluated_user_id = ?
      ORDER BY e.created_at DESC
      `,
      [req.params.project_id, req.params.uid]
    );

    res.json({
      completed: rows.filter((row) => row.status === "completed").length,
      pending: rows.filter((row) => row.status === "pending").length,
      required: REQUIRED_EVALUATIONS_PER_PROJECT,
      evaluations: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/book", async (req, res) => {
  const { project_id, evaluated_user_id } = req.body;

  if (!project_id || !evaluated_user_id) {
    return res.status(400).json({ error: "project_id and evaluated_user_id are required" });
  }

  try {
    await run("BEGIN IMMEDIATE TRANSACTION");

    const evaluatedUser = await get(
      "SELECT uid, evaluation_points FROM Users WHERE uid = ?",
      [evaluated_user_id]
    );

    if (!evaluatedUser) {
      await run("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    if (Number(evaluatedUser.evaluation_points) < 1) {
      await run("ROLLBACK");
      return res.status(400).json({ error: "You need at least 1 EVP to book an evaluation" });
    }

    const userProject = await get(
      "SELECT * FROM UserToProject WHERE user_id = ? AND project_id = ?",
      [evaluated_user_id, project_id]
    );

    if (!userProject) {
      await run("ROLLBACK");
      return res.status(403).json({ error: "This project is not available for the selected user" });
    }

    const evaluationCounts = await get(
      `
      SELECT
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
      FROM Evaluations
      WHERE evaluated_user_id = ?
        AND project_id = ?
      `,
      [evaluated_user_id, project_id]
    );

    const completed = Number(evaluationCounts?.completed || 0);
    const pending = Number(evaluationCounts?.pending || 0);

    if (completed + pending >= REQUIRED_EVALUATIONS_PER_PROJECT) {
      await run("ROLLBACK");
      return res.status(400).json({ error: "This project already has the required number of booked/completed evaluations" });
    }

    const evaluator = await get(
      `
      SELECT uid, name, surname, avatar
      FROM Users
      WHERE ready_for_evaluation = 1
        AND uid <> ?
      ORDER BY
        CASE WHEN ready_for_evaluation_since IS NULL THEN 1 ELSE 0 END,
        ready_for_evaluation_since ASC,
        uid ASC
      LIMIT 1
      `,
      [evaluated_user_id]
    );

    if (!evaluator) {
      await run("ROLLBACK");
      return res.status(400).json({ error: "No evaluator is currently ready for evaluation" });
    }

    const insertResult = await run(
      `
      INSERT INTO Evaluations(project_id, evaluated_user_id, evaluator_user_id, status, created_at)
      VALUES(?, ?, ?, 'pending', CURRENT_TIMESTAMP)
      `,
      [project_id, evaluated_user_id, evaluator.uid]
    );

    await run(
      `UPDATE Users
       SET evaluation_points = CASE
         WHEN evaluation_points > 0 THEN evaluation_points - 1
         ELSE 0
       END
       WHERE uid = ?`,
      [evaluated_user_id]
    );

    await run("COMMIT");

    res.status(201).json({
      message: "Evaluation booked successfully",
      evaluation_id: insertResult.lastID,
      evaluator
    });
  } catch (err) {
    try {
      await run("ROLLBACK");
    } catch (_) {
      // ignore rollback errors
    }
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/:evaluation_id/complete", async (req, res) => {
  const { evaluator_user_id, score, feedback } = req.body;
  const normalizedScore = normalizeScore(score);

  if (!evaluator_user_id) {
    return res.status(400).json({ error: "evaluator_user_id is required" });
  }

  if (normalizedScore === null) {
    return res.status(400).json({ error: "Score must be a number between 0 and 100" });
  }

  try {
    await run("BEGIN IMMEDIATE TRANSACTION");

    const evaluation = await get(
      `SELECT * FROM Evaluations WHERE evaluation_id = ?`,
      [req.params.evaluation_id]
    );

    if (!evaluation) {
      await run("ROLLBACK");
      return res.status(404).json({ error: "Evaluation not found" });
    }

    if (evaluation.evaluator_user_id !== evaluator_user_id) {
      await run("ROLLBACK");
      return res.status(403).json({ error: "This evaluation is assigned to another evaluator" });
    }

    if (evaluation.status === "completed") {
      await run("ROLLBACK");
      return res.status(400).json({ error: "Evaluation is already completed" });
    }

    await run(
      `
      UPDATE Evaluations
      SET status = 'completed',
          score = ?,
          feedback = ?,
          completed_at = CURRENT_TIMESTAMP
      WHERE evaluation_id = ?
      `,
      [normalizedScore, feedback || "", req.params.evaluation_id]
    );

    await run(
      `
      UPDATE Users
      SET evaluation_points = CASE
        WHEN evaluation_points < ? THEN evaluation_points + 1
        ELSE ?
      END
      WHERE uid = ?
      `,
      [MAX_EVALUATION_POINTS, MAX_EVALUATION_POINTS, evaluator_user_id]
    );

    const averageScore = await get(
      `
      SELECT ROUND(AVG(score)) AS score
      FROM Evaluations
      WHERE project_id = ?
        AND evaluated_user_id = ?
        AND status = 'completed'
      `,
      [evaluation.project_id, evaluation.evaluated_user_id]
    );

    await run(
      `
      INSERT INTO UserToProject(user_id, project_id, score)
      VALUES(?, ?, ?)
      ON CONFLICT(user_id, project_id)
      DO UPDATE SET score = excluded.score
      `,
      [evaluation.evaluated_user_id, evaluation.project_id, averageScore.score]
    );

    await run("COMMIT");

    res.json({
      message: "Evaluation completed successfully",
      score: averageScore.score
    });
  } catch (err) {
    try {
      await run("ROLLBACK");
    } catch (_) {
      // ignore rollback errors
    }
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
