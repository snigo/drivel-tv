import fetch from 'node-fetch';
import { Video } from '../models/video.model';

// Function that checks if video info is stored in DB - else, add it using YouTube API
export const storeVideosToDb = async (videoIds: string[]): Promise<Video[]> => {
  // As YouTube video API only allows requests of information for 50 videos at a time:
  // Split full video array into chuncks of 50, then look up relevant data and store in DB
  async function splitAndStore(videos: string[]) {
    try {
      const playlists = chunk<string>(videos, 50); // Split videos to 50 vid long chuncks
      const storedVideos = await Promise.all(playlists.map(async (playlist) => storeVideos(playlist)));
      return storedVideos.flat();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Logic for splitting array into 50 vid chuncks
  function chunk<T>(array: T[], size: number): T[][] {
    return Array.from(
      { length: Math.ceil(array.length / size) },
      (_, index) => array.slice(index * size, (index + 1) * size)
    );
  }

  // Function to retrive relevant data from YouTube API and store in DB using Mongoose
  async function storeVideos(playlist: string[]) {
    // Fetch video data using YouTube API
    const response = await fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=' + playlist.toString() + '&key=' + process.env.YT_API_KEY);
    const youtubeJSON = await response.json();
    const vidObjArray: Video[] = await Promise.all(youtubeJSON.items.map(async (video: any) => {

      // If thumnail resolution does not exist, use the next avalible size
      let imageUrl;
      if (video.snippet.thumbnails.maxres) imageUrl = video.snippet.thumbnails.maxres.url;
      else if (video.snippet.thumbnails.standard) imageUrl = video.snippet.thumbnails.standard.url;
      else if (video.snippet.thumbnails.high) imageUrl = video.snippet.thumbnails.high.url;
      else imageUrl = 'No thumbnail';

      // Create new video object
      const vidObj: Video = {
        youtubeId: video.id,
        title: video.snippet.title,
        thumbnailUrl: imageUrl,
        length: video.contentDetails.duration,
      };

      // Store in DB
      await Video.findOneAndUpdate(
        {youtubeId: video.id},
        {$setOnInsert: vidObj}, // Insert document if it does not exist
        { upsert: true, new: true, runValidators: true },
        function (error) {
          if (error) {
            console.log(error);
            throw new Error (error);
          }
        }
      );
      // Return all new objects as vidObjArray
      return vidObj;
    }));
    return vidObjArray;
  }

  return await splitAndStore(videoIds);
};
