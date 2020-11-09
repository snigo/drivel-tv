
const express = require('express');
const app = express();
const PORT = process.env.PORT;

//Replaces process.env variables with variables in .env file (comment out if deployed)
require('dotenv').config();


app.get('/', (req, res) => res.send('Hello world!'));


app.listen(process.env.PORT, (req, res) => {
  console.log(`Drivel server listening on port: ${process.env.PORT}`)
});
