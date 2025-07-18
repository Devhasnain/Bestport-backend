require("dotenv").config();
require("module-alias/register");
const http = require("http");
const app = require("./src");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const socketServer = require("./src/config/socketServer");
const { socketAuthMiddleware } = require("./src/middlewares/index");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.use(socketAuthMiddleware);
io.on("connection", socketServer);
server.listen(process.env.PORT, "0.0.0.0");
const onListening = async () => {
  console.log("server is up...");
  await connectDB();
};
server.on("listening", onListening);
