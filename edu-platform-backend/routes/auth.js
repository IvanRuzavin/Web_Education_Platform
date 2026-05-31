const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();

router.post("/login", (req,res) => {

    const { uid, password } = req.body;

    db.get(
        "SELECT * FROM Users WHERE uid=?",
        [uid],
        async (err,user) => {

            if(!user)
                return res.status(401).json();

            // TODO add encryption.
            const ok = password === user.password;

            if(!ok)
                return res.status(401).json();

            const token =
                jwt.sign(
                    { uid:user.uid },
                    "secret"
                );

            res.json({token});
        }
    );
});

module.exports = router;