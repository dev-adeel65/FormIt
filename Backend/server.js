// require('dotenv').config();

const express = require('express');
const connectDB = require('./DB/db');

const app = express();
connectDB();
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Welcome to FormIt Backend!');
});
app.use('/api/users', require('./routes/api/users'));
app.use('/api/forms', require('./routes/api/forms'));
app.use('/api/responses', require('./routes/api/responses'));

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
