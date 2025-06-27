const activeEmployees = new Map();
const activeCustomers = new Map();
const activeAdmins = new Map();

const emitOnlineUsersToAdmins = (socket) => {
  const payload = {
    employees: Object.fromEntries(activeEmployees),
    customers: Object.fromEntries(activeCustomers),
    admins: Object.fromEntries(activeAdmins),
  };

  activeAdmins.forEach((adminSocketId) => {
    socket.to(adminSocketId).emit("get-online-users", payload);
  });
};

const socketServer = async (socket) => {
  console.log(
    `User connected: ${socket.userId} ${socket.id} (${socket.userRole})`
  );

  // if (socket.userRole === "employee") {
  //   activeEmployees.set(socket.userId, socket.id);
  // }

  if (socket.userRole === "customer") {
    activeCustomers.set(socket.userId, socket.id);
  }

  if (socket.userRole === "admin") {
    activeAdmins.set(socket.userId, socket.id);
  }

  socket.on("online", () => {
    activeEmployees.set(socket.userId, socket.id);
    emitOnlineUsersToAdmins(socket);
  });

  emitOnlineUsersToAdmins(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    if (socket.userRole === "employee") {
      activeEmployees.delete(socket.userId);
      console.log(`Employee disconnected: ${socket.userId}`);
    }

    if (socket.userRole === "customer") {
      activeCustomers.delete(socket.userId);
      console.log(`Customer disconnected: ${socket.userId}`);
    }

    if (socket.userRole === "admin") {
      activeAdmins.delete(socket.userId);
      console.log(`Admin disconnected: ${socket.userId}`);
    }

    emitOnlineUsersToAdmins(socket);
  });
};

module.exports = socketServer;
