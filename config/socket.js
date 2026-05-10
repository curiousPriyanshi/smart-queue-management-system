let io;
const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors : {origin : '*'}
    });
    io.on('connection', (socket)=>{
        console.log("Client connected : ", socket.id);

        //specific client joins a queue:
        socket.on('join-queue', (queueId)=>{
            socket.join(`queue_${queueId}`);
            console.log(`Client ${socket.id} joined queue : queue_${queueId}`);
        })
        socket.on('disconnect', ()=>{
            console.log("Client disconnected : ", socket.id);
        })
    })
    return io;
}

const getIO = () => {
    if(!io) throw new Error("socket not initialized!");
    return io;
}
module.exports = {initSocket, getIO};