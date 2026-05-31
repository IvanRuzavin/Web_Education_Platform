const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/:uid", (req,res)=>{

    db.get(
        "SELECT uid,name,surname,progress,experience,level,rank,avatar,email,birthplace,phone FROM Users WHERE uid=?",
        [req.params.uid],
        (err,row)=>{

            res.json(row);
        }
    );
});

module.exports = router;