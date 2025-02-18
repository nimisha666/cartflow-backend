const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({ message: 'Invalid token or expired.' });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.error('Error while verifying token', error);
        res.status(401).send({ message: 'Error while verifying token.' });
    }
}

module.exports = verifyToken;
