//  Async Handling Middleware Function for use in Routes

exports.asyncHandler = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (err) {
            next(err)
        }
    }
}