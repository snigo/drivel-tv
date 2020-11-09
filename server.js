
const express = require('express');
const app = express();
const path = require('path');

//Replaces process.env variables with variables in .env file (comment out if deployed)
//require('dotenv').config();


//Serve static files (index.html) from from build folder
app.use(express.static(path.join(__dirname, 'client/build')));


//Test-request
app.get('/hey', (req, res) => res.status(777).send('HO!'));

app.listen(process.env.PORT, (req, res) => { // eslint-disable-line no-unused-vars
  console.log(`Drivel server listening on port: ${process.env.PORT}`);
});

