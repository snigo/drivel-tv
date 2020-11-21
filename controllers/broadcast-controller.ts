import schedule from 'node-schedule';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { convertPlaylist } from '../youtube-api/playlist-api';
import { findVideo } from '../youtube-api/find-api';
import { startCron } from '../cron/cron';
import { Broadcast } from '../models/broadcast.model';



// Get all broadcast objects
export const getAllBroadcast = async (_: Request, res: Response) => {
  // Find all broadcast objects and send back to client
  Broadcast.find({}, (_: Error, broadcasts: Broadcast[]) => {
    if (broadcasts === null) res.status(404).send('404'); // If not found, send 404
    else res.status(200).json(broadcasts); // Else if found, send broadcast obj back
  });
};

// Get broadcast object
export const getBroadcast = async (req: Request, res: Response) => {
  // Get broadcast id from request
  const broadId: string = req.body.broadcastId;

  // Find specific broadcast object and send back to client
  Broadcast.findOne({ broadcastId: broadId }, (_: Error, broadcast: Broadcast) => {
    if (broadcast === null) res.status(404).send('404'); // If not found, send 404
    else res.status(200).json(broadcast); // Else if found, send broadcast obj back
  });
};

// Create broadcast function
export const createBroadcast = async (req: Request, res: Response) => {
  try {
    // Destruct client request data
    const { title, description, tags, owner, isReversed, youtubePlaylists } = req.body;
    // Run client data through our YouTube API helper function and return relevant data
    const { broadcastId, thumbnailUrl, youtubePlaylistIds, videoArray, currentVideo, nextVideo } = await convertPlaylist(isReversed, youtubePlaylists);

    // Return full video object from DB to access length property (video duration - see Broadcast.create below)
    const currentVid = await findVideo(currentVideo);
    const nextVid = await findVideo(nextVideo);

    //Store broadcast data in object
    const broadcastObj = {
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
      currentVideoLength: currentVid?.length || 0,
      currentTime: 0,
      nextVideo: nextVideo,
      nextVideoLength: nextVid?.length || 0
    };

    //Store broadcast in DB using Mongoose
    await Broadcast.create(broadcastObj);

    // Start CRON timer (update broadcast every second)
    startCron(broadcastId);

    // Send broadcast back to client
    res.status(200).json(broadcastObj);

  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// Delete broadcast function
export const deleteBroadcast = async (req: Request, res: Response) => {
  try {
    // Delete broadcast from DB using Mongoose
    await Broadcast.deleteOne({ broadcastId: req.body.broadcastId });

    const broadcastId = req.body.broadcastId; // TO DO - CHANGE TO URL PARAMETER - Get broadcast id from client
    // If broadcast id exists, delete broadcast - else, throw error
    if (schedule.scheduledJobs[broadcastId]) {
      let currentBroadcast = schedule.scheduledJobs[broadcastId];
      currentBroadcast.cancel();
      res.status(200).send(broadcastId);
    } else {
      throw new Error ('Broadcast id does not exist');
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};