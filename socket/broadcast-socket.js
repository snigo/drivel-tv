
module.exports = (io) => {

  //When a user connects to a broadcast room
  io.on('connection', (socket) => { // eslint-disable-line no-unused-vars
    //console.log('a user connected');

    //Join room
    socket.on('join', (room) => {
      socket.join(room);
      console.log(socket.id, 'joined', room);
    });

    //Send all chat messages back to all users in room
    socket.on('chat message to server', (data) => {
      io.to(data.room).emit('chat message to client', data.msg);
    });

    socket.on('disconnect', () => {
      //console.log('a user disconnected');
    });

  });

};