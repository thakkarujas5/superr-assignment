const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, roles: ['TEACHER', ...] }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// Authorization middleware (roles: array of allowed roles)
function authorize(roles = []) {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        // Allow if user has at least one required role
        const hasRole = req.user.roles.some(role => roles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }
         next();
    };
}

module.exports = { authenticate, authorize };