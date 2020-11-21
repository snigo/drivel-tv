import schedule from 'node-schedule';
import * as moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { Broadcast } from '../models/broadcast.model';
import { Video } from '../models/video.model';
import { Error } from 'mongoose';

momentDurationFormatSetup(moment);

// Start timer that updates broadcast every second
export const startCron = (broadcastId: string) => {
  // If broadcast id does not exist, start broadcast - else, throw error
  if (!schedule.scheduledJobs[broadcastId]) {
    schedule.scheduleJob(broadcastId, '* * * * * *', function () {
      Broadcast.findOne({ broadcastId }, async (err: Error, broadcast: any) => {
        if (err) throw new Error (`Could not find broadcast in DB!\n Error message: ${err}`);

        // Convert YouTube timestamp to seconds (and remove commas produced by moment plugin)
        const length = Number(moment.duration(broadcast.currentVideoLength).format('ss').replace(/,/g, ''));

        // If current timestamp is less than video duration, increment with 1 second
        if (broadcast.currentTime < length) {
          broadcast.currentTime = ++broadcast.currentTime; // Increment timestamp by 1
          broadcast.save(); // Save to DB
        } else {
          // If video has finsihed playing,
          // shift current video to the back of the queue and update video & timestamp data
          let newVideoArray = broadcast.videoArray;
          newVideoArray.push(newVideoArray.shift()); // Shift queue

          // Find video length of next video in queue
          const nextLength = await Video.findOne({ youtubeId: newVideoArray[1] }, (err: Error) => {
            if (err) throw new Error (`Could not find next video in DB!\nError message: ${err}`);
          });

          // Update broadcast object
          broadcast.videoArray = newVideoArray; // Set shifted queue as new array of videos
          broadcast.currentVideo = newVideoArray[0]; // Set new beginning of queue as first video
          broadcast.currentVideoLength = broadcast.nextVideoLength; // Set next video's length as current length
          broadcast.currentTime = 0; // Reset timestamp
          broadcast.nextVideo = newVideoArray[1]; // Set new next vide
          broadcast.nextVideoLength = nextLength?.toString().length; // Set next video length using value fetched from DB
          broadcast.save(); // Save to DB
        }
      });
    });
  } else {
    throw new Error ('Broadcast id already exists');
  }
};