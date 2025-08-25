const socket = require("../config/socketClient");

const SocketWorker = {
    assignJob:(payload)=>{
        console.log('socket working')
        socket.emit("assignJob",payload)
    }
};

module.exports = SocketWorker