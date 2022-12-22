const morgan = require('morgan');
exports.logger = async (req, res, next) => {
    try {
        if (process.env.NODE_ENV == "production") {
            const _logger = morgan("dev")
            _logger(req, res, function (error) {
                if (error) return next(error)
                next()
            })
        } else {
            next()
        }
    } catch (error) {
        next(error);
    }
}
