require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const morgan = require('morgan')
const app = express();

const port = process.env.PORT || 3000;
const db_url = process.env.DB_URI;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Corrected: properly invoke express.json()
app.use(cors());
app.use(morgan('dev'))

// Routes
app.use('/api', routes);

app.listen(port, async () => {
    try {
        await mongoose.connect(db_url);
        console.log('MongoDB connected');
        console.log('Server running on port:', port);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
