const express = require("express");
const db = require("../lib/db.js");

const loginRouter = express.Router();

loginRouter.post("/login", (req, res) => {
    const { account, pwd } = req.body;
})

loginRouter.post("/register", (req, res) => {
    const { account, pwd } = req.body;

    console.log(req.body);

})

module.exports = loginRouter;