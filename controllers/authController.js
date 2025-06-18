const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords', error: err });
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            // Remove password from user object before sending
            const { password: pwd, ...userWithoutPassword } = user;

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ token, user: userWithoutPassword });
        });
    });
};

// Register controller
exports.register = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    // Check if user already exists
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length > 0) return res.status(409).json({ message: 'User already exists' });

        // Hash the password and insert new user
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password', error: err });
            db.query(
                'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
                [name, email, hash],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error', error: err });
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    });
};