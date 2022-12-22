"use strict";

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/user.controller");
const { loginValidator, signUpValidator } = require('../validators/user.validator')

router
    .post("/signup", signUpValidator, registerUser)
    .post("/login", loginValidator, loginUser)



module.exports = router;