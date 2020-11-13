
// Import CRON-like module for broadcast timestamp scheduling
const schedule = require('node-schedule');

// Import models
const Broadcast = require('../models/Broadcast-model');
const Video = require('../models/Video-model');

// Import moment to decode YouTube timestamp
let moment = require('moment');
let momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

// Import functions that uses YouTube API to get relevant data
const {convertPlaylist} = require('../youtube-api/playlist-api');
const {findVideo} = require('../youtube-api/find-api');

// Create broadcast function
exports.createBroadcast = async (req, res) => {

  try {

    // Destruct client request data
    const { title, description, tags, owner, isReversed, youtubePlaylists} = req.body;
    // Run client data through our YouTube API helper function and return relevant data
    const { broadcastId, thumbnailUrl, youtubePlaylistIds, videoArray, currentVideo, nextVideo } = await convertPlaylist(isReversed, youtubePlaylists);

    // Return full video object from DB to access length property (video duration - see Broadcast.create below)
    const currentVid = await findVideo(currentVideo);
    const nextVid = await findVideo(nextVideo);


    //Store broadcast in DB using Mongoose
    await Broadcast.create({
      broadcastId: broadcastId,
      title: title,
      description: description,
      tags: tags,
      thumbnailUrl: thumbnailUrl,
      owner: owner,
      isReversed: isReversed,
      youtubePlaylists: youtubePlaylistIds,
      videoArray: videoArray,
      currentVideo: currentVideo,
      currentVideoLength: currentVid[0].length,
      currentTime: 0,
      nextVideo: nextVideo,
      nextVideoLength: nextVid[0].length
    });


    // Start timer that updates broadcast every second
    ////////////////
    // If broadcast id does not exist, start broadcast - else, throw error
    if (!schedule.scheduledJobs[broadcastId]) {
      schedule.scheduleJob(broadcastId, '* * * * * *', function () {
        /* Broadcast.findOneAndUpdate({broadcastId: broadcastId}, {$inc : {'currentTime' : 1}}, (err) => { if (err) console.log(err);});
        console.log('Time updated - Id:', broadcastId); */

        Broadcast.findOne({broadcastId: broadcastId}, async (err, broadcast) => {
          if (err) throw new Error ('Could not find broadcast in DB!', err);

          // Convert YouTube timestamp to seconds
          const length = Number(moment.duration(broadcast.currentVideoLength).format('ss'));

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
            const nextLength = await Video.findOne({youtubeId: newVideoArray[1]}, (err) => {
              if (err) throw new Error ('Could not find next video in DB!', err);
            });

            // Update broadcast object
            broadcast.videoArray = newVideoArray; // Set shifted queue as new array of videos
            broadcast.currentVideo = newVideoArray[0]; // Set new beginning of queue as first video
            broadcast.currentVideoLength = broadcast.nextVideoLength; // Set next video's length as current length
            broadcast.currentTime = 0; // Reset timestamp
            broadcast.nextVideo = newVideoArray[1]; // Set new next vide
            broadcast.nextVideoLength = nextLength.length; // Set next video length using value fetched from DB
            broadcast.save(); // Save to DB

          }
        });

      });
      res.status(200).send('Created!');
    } else {
      throw new Error ('Broadcast id already exists');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

};


// Delete broadcast function
exports.deleteBroadcast = async (req, res) => {
  try {

    // Delete broadcast from DB using Mongoose
    await Broadcast.deleteOne({broadcastId: req.body.broadcastId});

    const broadcastId = req.body.broadcastId; // TO DO - CHANGE TO URL PARAMETER - Get broadcast id from client
    // If broadcast id exists, delete broadcast - else, throw error
    if (schedule.scheduledJobs[broadcastId]) {
      let currentBroadcast = schedule.scheduledJobs[broadcastId];
      currentBroadcast.cancel();
      res.status(200).send('Deleted!');
    } else {
      throw new Error ('Broadcast id does not exist');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};