const { error } = require("../constants/messages")
const { errorRes } = require("../utils/formatRes")
const { tokenVerify } = require('../utils/jwt')


exports.authCheck = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            errorRes(
                res,
                null,
                error.UNAUTHORIZED,
                401
            )
            return;
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            errorRes(
                res,
                null,
                error.UNAUTHORIZED,
                401
            )
            return;
        }
        tokenVerify(token, function (err, payload) {
            if (err?.name == "TokenExpiredError") {
                errorRes(
                    res,
                    err,
                    error.TOKEN_EXPIRED,
                    401
                )
                return;
            }
            if (err) {
                errorRes(
                    res,
                    err,
                    err?.message ?? "Internal server error.",
                    401
                )
                return;
            }
            req.userId = payload.data
            return next()
        })
    } catch (error) {
        next(error);
    }
}