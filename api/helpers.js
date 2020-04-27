function silentErrorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.sendStatus(500);
}

function notFoundHandler(req,res) {
    res.sendStatus(404);
}

module.exports = {
    silentErrorHandler,
    notFoundHandler
};