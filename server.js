require('dotenv').config();
require('module-alias/register');
const http = require('http');
const app = require('./src');
const connectDB = require('./src/config/db');

const server = http.createServer(app);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

(async () => {
  await connectDB();
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  });
})();
