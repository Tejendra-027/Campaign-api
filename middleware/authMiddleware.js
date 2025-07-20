const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to request object
        req.user = decoded;

        // Optional: Logging
        // console.log('Authenticated user:', decoded);

        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
