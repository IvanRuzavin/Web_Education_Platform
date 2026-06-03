const express = require("express");
const db = require("../db");

const router = express.Router();

const PUBLIC_USER_FIELDS = `
  uid,
  name,
  surname,
  progress,
  experience,
  level,
  rank,
  avatar,
  email,
  birthplace,
  phone,
  status,
  is_online,
  evaluation_points,
  ready_for_evaluation,
  ready_for_evaluation_since
`;

router.get("/", (req, res) => {
  db.all(
    `SELECT ${PUBLIC_USER_FIELDS} FROM Users ORDER BY name, surname`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    }
  );
});

router.get("/:uid", (req, res) => {
  db.get(
    `SELECT ${PUBLIC_USER_FIELDS} FROM Users WHERE uid = ?`,
    [req.params.uid],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json(row);
    }
  );
});

router.put("/:uid", (req, res) => {
  const allowedFields = [
    "password",
    "avatar",
    "email",
    "birthplace",
    "phone",
    "is_online",
    "status",
    "ready_for_evaluation"
  ];

  const updates = [];
  const params = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      if (field === "ready_for_evaluation") {
        const isReady = req.body.ready_for_evaluation ? 1 : 0;
        updates.push("ready_for_evaluation = ?");
        params.push(isReady);
        updates.push("ready_for_evaluation_since = ?");
        params.push(isReady ? new Date().toISOString() : null);
      } else if (field === "password") {
        if (req.body.password) {
          updates.push("password = ?");
          params.push(req.body.password);
        }
      } else {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }
  }

  if (updates.length === 0) {
    return res.json({ message: "No changes provided" });
  }

  params.push(req.params.uid);

  db.run(
    `UPDATE Users SET ${updates.join(", ")} WHERE uid = ?`,
    params,
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User updated successfully" });
    }
  );
});

module.exports = router;
