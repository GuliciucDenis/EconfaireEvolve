const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const objectiveRoutes = require('./routes/objectiveRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Allow app to accept requests from any origin
app.use(cors());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/users/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/objectives', objectiveRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
