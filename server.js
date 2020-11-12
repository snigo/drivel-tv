
// Import dependencies
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const router = require('./router');

// Call io module with io instance
require('./socket/broadcast-socket')(io);

// If app is in dev mode, replace process.env variables with variables in .env file
if (process.env.NODE_ENV !== 'production') require('dotenv').config();


// Parse API requests as JSON
app.use(express.json());
// For api requests, rout them through router file
app.use(router);

// Serve static files (index.html) from from build folder
app.use(express.static(path.join(__dirname, 'client/build')));
// Leverage React routing, return requests to React
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


// Listen for new requests
http.listen(process.env.PORT, (req, res) => { // eslint-disable-line no-unused-vars
  console.log(`Drivel server listening on port: ${process.env.PORT}`);
});

