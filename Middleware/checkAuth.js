var jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.auth, process.env.authkey);
        req.decodedUserData = decoded;
    } catch(err) {
        return res.status(401).json({
            message: 'auth failed'
        })
    }
    next();
}