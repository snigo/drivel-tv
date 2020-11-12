
// Import CRON-like module for broadcast timestamp scheduling
const schedule = require('node-schedule');
const Broadcast = require('../models/Broadcast-model');

// Import function that uses YouTube API to get relevant data
const {convertPlaylist} = require('../youtube-api/youtube-api');

// Create broadcast function
exports.createBroadcast = async (req, res) => {

  try {

    // Destruct client request data
    const { title, description, tags, owner, isReversed, youtubePlaylists} = req.body;
    // Run client data through our YouTube API helper function and return relevant data
    const { broadcastId, thumbnailUrl, youtubePlaylistIds, videoArray, currentVideo, currentVideoLength, currentVideoTime, nextVideo, nextVideoLength } = await convertPlaylist(isReversed, youtubePlaylists);

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
      currentVideoLength: currentVideoLength,
      currentVideoTime: currentVideoTime,
      nextVideo: nextVideo,
      nextVideoLength: nextVideoLength
    });


    // Start timer that keeps track of current broadcast timestamp
    ////////////////
    let currentTime = 0; // Set initial video timestamp to 0
    // If broadcast id does not exist, start broadcast - else, throw error
    if (!schedule.scheduledJobs[broadcastId]) {
      schedule.scheduleJob(broadcastId, '* * * * * *', function () {
        currentTime++;
        console.log('Time: ' + currentTime, 'Id:', broadcastId);
      });
      res.status(200).send('Created!');
    } else {
      throw new Error ('Broadcast id allready exists');
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