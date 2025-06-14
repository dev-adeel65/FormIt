const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers['x-auth-token'];

	if (!token) {
		return res.status(401).json({ error: 'No token provided, authorization denied' });
	}

	try {
		jwt.verify(token, "haseeb", (err, decoded) => {
			if (err) {
				return res.status(401).json({ error: 'Invalid token' });
			}

			req.user = decoded.user;
			next();
		});
	} catch (error) {
		console.error('JWT Token decoding error!', error);
		return res.status(401).json({ error: 'Invalid or missing authentication token' });
	}
};

