
exports.successRes = (res, data, message = null, statusCode) => {
    if (statusCode) {
        res.status(statusCode).json({
            status: true,
            data,
            message,
            error: null
        });
    } else {
        res.json({
            status: true,
            data,
            message,
            error: null
        });
    }
};

exports.errorRes = (res, error, message = null, statusCode) => {
    if (statusCode) {
        res.status(statusCode).json({
            status: false,
            data: null,
            message,
            error
        });
    } else {
        res.json({
            status: false,
            data: null,
            message,
            error
        });
    }
};