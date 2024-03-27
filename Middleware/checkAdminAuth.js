var jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.get('Authorization'), process.env.adminAuthKey);
        req.decodedUserData = decoded;
    } catch(err) {
        return res.status(401).json({
            message: 'auth failed'
        })
    }
    next();
}
