const { body, param, query } = require("express-validator");
const { error } = require("../constants/messages");
const { Mongoose } = require("../database");


exports.createValidator = [
    body("title")
        .not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("title"))
        .isLength({ min: 3, max: 20 }).withMessage("Title length should be between 3 and 20 characters."),
    body("description")
        .not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("description"))
        .isLength({ min: 10, max: 3000 }).withMessage("Description length should be between 10 and 3000 characters."),
    body("image").not().isEmpty().withMessage(error.FIELD_NOT_PRESENT("image")),
];

exports.updateValidator = [
    body('_id')
        .not()
        .isEmpty()
        .withMessage(error.FIELD_NOT_PRESENT("_id"))
        .custom(value => {
            if (!Mongoose.Types.ObjectId.isValid(value)) {
                return Promise.reject(error.NOT_VALID_ID)
            }
            return true;
        })
];

exports.deleteValidator = [
    param('id')
        .not()
        .isEmpty()
        .withMessage(error.FIELD_NOT_PRESENT("id"))
        .custom(value => {
            if (!Mongoose.Types.ObjectId.isValid(value)) {
                return Promise.reject(error.NOT_VALID_ID)
            }
            return true;
        })
];
exports.singlePostValidator = [
    query('title')
        .not()
        .isEmpty()
        .withMessage(error.FIELD_NOT_PRESENT("title"))
];



