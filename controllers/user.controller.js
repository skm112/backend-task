const { UserModel } = require("../database").models;
const { error, success } = require("../constants/messages")
const { errorRes, successRes } = require("../utils/formatRes")
const { validationResult } = require("express-validator");
const { tokenSign } = require("../utils/jwt")

exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        const userExist = await UserModel.findOne({ "username": req.body.username });
        if (userExist) {
            errorRes(
                res,
                null,
                error.ALREADY_EXIST,
                400
            )
            return;
        }
        const createUser = new UserModel(req.body);
        const user = await createUser.save();
        successRes(
            res,
            { userId: user._id },
            success.ACCOUNT_CREATED,
            201
        )
        return;
    } catch (error) {
        next(error);
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorRes(
                res,
                errors.mapped(),
                error.REQUIRED_FIELD,
                400
            )
            return;
        }
        const user = await UserModel.findOne({ "username": req.body.username });
        if (!user) {
            errorRes(
                res,
                null,
                error.NOT_FOUND,
                400
            )
            return;
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
                return next(err);
            }
            if (!isMatch) {
                errorRes(
                    res,
                    null,
                    error.INCORRECT_PASSWORD,
                    400
                )
                return;
            }
            tokenSign(user._id, function (err, token) {
                if (err) {
                    return next(err);
                }
                successRes(
                    res,
                    { userId: user._id, token },
                    success.LOGIN_SUCCESS,
                    201
                )
            })
        })

    } catch (error) {
        next(error);
    }
}

