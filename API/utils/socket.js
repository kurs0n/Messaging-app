let io;

module.exports = { 
    init: server=>{
        io = require('socket.io')(server);
        return io;
    },
    getIo: ()=>{
        if(!io){
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};