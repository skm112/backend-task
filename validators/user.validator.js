const { body } = require("express-validator");
const { error } = require("../constants/messages");


exports.signUpValidator = [
    body("name").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("name")),
    body("username").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("username")),
    body("password").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("password")).isStrongPassword({
        minLength: 6, minUppercase: 1, minNumbers: 1, minLowercase: 1, minSymbols: 1
    }),
];

exports.loginValidator = [
    body("username").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("username")),
    body("password").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("password")),
];



