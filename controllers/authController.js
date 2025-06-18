const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ err });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
};
