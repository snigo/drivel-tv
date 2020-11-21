import { startCron } from './cron';
import { Broadcast } from '../models/broadcast.model';

// Function that finds all broadcasts and start their timers
export const startAllCron = () => {
  // Find all broadcasts in DB using Mongoose
  Broadcast.find({}, (_, broadcasts: Broadcast[]) => {
    // For each broadcast, start a corresponding timer
    broadcasts.forEach((broadcast) => {
      startCron(broadcast.broadcastId);
    });
  });
};
