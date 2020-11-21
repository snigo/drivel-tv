import { Server as HttpServer } from 'http';
import path from 'path';
import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { Server as IoServer } from 'socket.io';
import { router } from './router';
import { startAllCron } from './cron/cron-startup';
import { broadcastSocket } from './socket/broadcast-socket';

dotenv.config();
const { MONGO_DB, PORT } = process.env;

const app = express();
const http = new HttpServer(app);
const io = new IoServer(http);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(router);
app.get('*', function (_, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

(async () => {
  try {
    await connect(MONGO_DB || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    broadcastSocket(io);
    await startAllCron();
    app.listen(PORT, () => {
      console.log(`Drivel server connected to DB and listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log('Could not connect to database', error);
  }
})();
