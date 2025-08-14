require('dotenv').config();
require('module-alias/register');
const http = require('http');
const app = require('./src');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const socketServer = require('./src/config/socketServer');
const { socketAuthMiddleware } = require('./src/middlewares/index');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

io.use(socketAuthMiddleware);
io.on('connection', socketServer);

(async () => {
  await connectDB(); // Ensure DB connection before starting server
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  });
})();
