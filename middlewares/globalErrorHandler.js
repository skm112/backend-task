const { errorRes } = require("../utils/formatRes")

exports.handleError = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error.';
    const data = err.data || null;
    errorRes(
        res,
        data,
        message,
        status
    )
    return;
}