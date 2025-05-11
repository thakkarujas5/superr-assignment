const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Dummy user DB (replace with real DB)
const users = [
    { id: 1, username: 'teacher1', password: 'pass', roles: ['TEACHER'] },
    { id: 2, username: 'student1', password: 'pass', roles: ['STUDENT'] },
    { id: 3, username: 'admin1', password: 'pass', roles: ['ADMIN'] },
    { id: 4, username: 'superuser', password: 'pass', roles: ['TEACHER', 'ADMIN'] }
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Issue JWT
    const token = jwt.sign({ userId: user.id, roles: user.roles }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
