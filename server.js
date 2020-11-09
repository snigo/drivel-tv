
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => res.send('Hello world!'));


app.listen(PORT, (req, res) => {
  console.log(`Drivel server listening on port: ${PORT}`)
});
