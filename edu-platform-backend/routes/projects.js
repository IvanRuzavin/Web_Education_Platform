const express = require("express");
const db = require("../db");

const router = express.Router();

const splitList = (value) => {
  if (!value) return [];
  return String(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
};

const hydrateProject = (row) => {
  if (!row) return row;
  return {
    ...row,
    is_available: Boolean(row.is_available),
    learning_goals: splitList(row.learning_goals),
    requirements: splitList(row.requirements),
    completed_evaluations: Number(row.completed_evaluations || 0),
    pending_evaluations: Number(row.pending_evaluations || 0),
    remaining_evaluations: Math.max(0, 2 - Number(row.completed_evaluations || 0))
  };
};

router.get("/catalog/:uid", (req, res) => {
  db.all(
    `
    SELECT
      p.project_id,
      p.project_name,
      p.complexity,
      p.description,
      p.peripheral,
      p.image_url,
      p.pdf_url,
      utp.score,
      CASE WHEN utp.user_id IS NULL THEN 0 ELSE 1 END AS is_available,
      COALESCE(e.completed_evaluations, 0) AS completed_evaluations,
      COALESCE(e.pending_evaluations, 0) AS pending_evaluations
    FROM Projects p
    LEFT JOIN UserToProject utp
      ON utp.project_id = p.project_id
     AND utp.user_id = ?
    LEFT JOIN (
      SELECT
        project_id,
        evaluated_user_id,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_evaluations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_evaluations
      FROM Evaluations
      GROUP BY project_id, evaluated_user_id
    ) e
      ON e.project_id = p.project_id
     AND e.evaluated_user_id = ?
    ORDER BY p.project_id
    `,
    [req.params.uid, req.params.uid],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows.map(hydrateProject));
    }
  );
});

router.get("/project/:project_id", (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid query parameter" });
  }

  db.get(
    `
    SELECT
      p.project_id,
      p.project_name,
      p.complexity,
      p.description,
      p.peripheral,
      p.image_url,
      p.pdf_url,
      p.learning_goals,
      p.requirements,
      utp.score,
      CASE WHEN utp.user_id IS NULL THEN 0 ELSE 1 END AS is_available,
      COALESCE(e.completed_evaluations, 0) AS completed_evaluations,
      COALESCE(e.pending_evaluations, 0) AS pending_evaluations
    FROM Projects p
    LEFT JOIN UserToProject utp
      ON utp.project_id = p.project_id
     AND utp.user_id = ?
    LEFT JOIN (
      SELECT
        project_id,
        evaluated_user_id,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_evaluations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_evaluations
      FROM Evaluations
      GROUP BY project_id, evaluated_user_id
    ) e
      ON e.project_id = p.project_id
     AND e.evaluated_user_id = ?
    WHERE p.project_id = ?
    `,
    [uid, uid, req.params.project_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!row) return res.status(404).json({ error: "Project not found" });
      res.json(hydrateProject(row));
    }
  );
});

router.get("/:uid", (req, res) => {
  db.all(
    `
    SELECT
      p.project_id,
      p.project_name,
      p.complexity,
      p.description,
      p.peripheral,
      p.image_url,
      p.pdf_url,
      utp.score,
      1 AS is_available,
      COALESCE(e.completed_evaluations, 0) AS completed_evaluations,
      COALESCE(e.pending_evaluations, 0) AS pending_evaluations
    FROM UserToProject utp
    JOIN Projects p
      ON p.project_id = utp.project_id
    LEFT JOIN (
      SELECT
        project_id,
        evaluated_user_id,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_evaluations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_evaluations
      FROM Evaluations
      GROUP BY project_id, evaluated_user_id
    ) e
      ON e.project_id = p.project_id
     AND e.evaluated_user_id = utp.user_id
    WHERE utp.user_id = ?
    ORDER BY p.project_id
    `,
    [req.params.uid],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows.map(hydrateProject));
    }
  );
});

module.exports = router;
