const express = require('express');
const errorMiddleware = require('./middleware/error');

const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
const todo = require('./routes/todoRoutes');

app.use('/todo', todo);

// Middleware for Error
app.use(errorMiddleware);

module.exports = app