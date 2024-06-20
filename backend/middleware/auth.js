const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    console.log(req.header)
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const user = await User.findById(decoded.user.id).select('username');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        req.user = {
            id: decoded.user.id,
            username: user.username
        };
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
