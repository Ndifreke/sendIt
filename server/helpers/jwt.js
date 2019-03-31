/**
 * Authenticate a token that was generated by id
 * @param {response} res - Request object
 *  @param {response} resp - Request object
 * @param {request} callback - Callback function which the verified token will be passed to
 * @returns {void}
 */
function verifyAccessToken(token) {
    if (!token) 
        token = req.headers['authorization'];
    jwt.verify(token, SECRET, function (err, userToken) {
        if (err) {
            resp.statusCode = 403;
            resp.json(util.response("error", "Access denied", 0))
        } else if (callback) {
            callback(userToken);
        }
    });
}
