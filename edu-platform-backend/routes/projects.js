const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:uid", (req,res)=>{

    db.all(`
        SELECT *
        FROM UserToProject
        WHERE user_id=?
    `,
    [req.params.uid],
    (err,rows)=>{

        res.json(rows);
    });

});

module.exports = router;