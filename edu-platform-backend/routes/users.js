const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.all(
    `SELECT uid,name,surname,progress,experience,level,rank,avatar,email,birthplace,phone,status,is_online
     FROM Users`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.json(rows);
    }
  );
});

router.get("/:uid", (req,res)=>{

    db.get(
        "SELECT uid,name,surname,progress,experience,level,rank,avatar,email,birthplace,phone,status,is_online FROM Users WHERE uid=?",
        [req.params.uid],
        (err,row)=>{

            res.json(row);
        }
    );
});

router.put("/:uid", (req, res) => {
  const {
    password,
    avatar,
    email,
    birthplace,
    phone,
    is_online,
    status
  } = req.body;

  let query = `
    UPDATE Users
    SET
      avatar = ?,
      email = ?,
      birthplace = ?,
      phone = ?,
      is_online = ?
      ${status ? ", status = ?" : ""}
      ${password ? ", password = ?" : ""}
    WHERE uid = ?
  `;

  let params = [
    avatar,
    email,
    birthplace,
    phone,
    is_online,
    status
  ];

  if (password) {
    params.push(password);
  }

  params.push(req.params.uid);

  db.run(query, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "User updated successfully" });
  });
});

module.exports = router;