const activeEmployees = new Map();
const activeCustomers = new Map();
const activeAdmins = new Map();

const socketServer = async (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);

  if (socket.userRole === "employee") {
    activeEmployees.set(socket.userId, socket.id);
  }

  if (socket.userRole === "customer") {
    activeCustomers.set(socket.userId, socket.id);
  }

  if (socket.userRole === "admin") {
    activeAdmins.set(socket.userId, socket.id);

    // Emit event with all online users to the connected admin
    socket.emit("get-online-users", {
      employees: Object.fromEntries(activeEmployees),
      customers: Object.fromEntries(activeCustomers),
      admins: Object.fromEntries(activeAdmins),
    });
  }

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
  });
};

module.exports = socketServer;
