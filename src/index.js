const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
connectDB();


// Load env variables
dotenv.config();

// App setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use('/api/auth', authRoutes);
app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Sample route
app.get('/health', (req, res) => {
  res.send({ status: 'OK' });
});

// Socket setup
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
