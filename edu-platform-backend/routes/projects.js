const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:uid", (req, res) => {
  db.all(
    `
    SELECT
      p.project_name,
      utp.score
    FROM UserToProject utp
    JOIN Projects p
      ON p.project_id = utp.project_id
    WHERE utp.user_id = ?
    `,
    [req.params.uid],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.json(rows);
    }
  );
});

module.exports = router;