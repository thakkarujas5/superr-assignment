const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const sequelize = require('sequelize');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

// SIGNUP
const signup = async (req, res) => {
    const { username, password, roles } = req.body;
    if (!username || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({ message: 'Username, password, and at least one role are required.' });
    }
    try {
        // Check if username exists
        const [existing] = await db.query(
            `SELECT id FROM Users WHERE username = :username`,
            { replacements: { username }, type: sequelize.QueryTypes.SELECT }
        );
        if (existing) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user with hashed password
        await db.query(
            `INSERT INTO Users (username, password, roles) VALUES (:username, :password, :roles)`,
            { replacements: { username, password: hashedPassword, roles: JSON.stringify(roles) } }
        );
        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
};

// LOGIN
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Get user with hashed password
        const [user] = await db.query(
            `SELECT * FROM Users WHERE username = :username`,
            { replacements: { username }, type: sequelize.QueryTypes.SELECT }
        );
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }
};

const authControllers = {
    signup,
    login
};

module.exports = authControllers;