
// Import dependencies
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const path = require('path');

// If app is in dev mode, replace process.env variables with variables in .env file
if (process.env.NODE_ENV !== 'production') require('dotenv').config();


//TEST TIMER
let time = 0;
setInterval(() => {
  time++;
}, 1000);


//When a user connects to a broadcast room
io.on('connection', (socket) => { // eslint-disable-line no-unused-vars
  //console.log('a user connected');

  //Join room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(socket.id, 'joined', room);
  });

  //Send current timestamp of broadcast to user
  socket.on('get current time', (data) => {
    console.log('Use to get correct timer - Room:', data.room);
    socket.emit('current time', time);
  });

  //Send all chat messages back to all clients
  socket.on('chat message to server', (data) => {
    io.to(data.room).emit('chat message to client', data.msg);
  });

  socket.on('disconnect', () => {
    //console.log('a user disconnected');
  });

});



// Serve static files (index.html) from from build folder
app.use(express.static(path.join(__dirname, 'client/build')));
// Leverage React routing, return requests to React
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


// TEST REQUEST
app.get('/new-chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

//Listen for new requests
http.listen(process.env.PORT, (req, res) => { // eslint-disable-line no-unused-vars
  console.log(`Drivel server listening on port: ${process.env.PORT}`);
});

