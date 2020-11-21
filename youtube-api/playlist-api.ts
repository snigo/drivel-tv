import fetch from 'node-fetch';
import url from 'url';
import querystring from 'querystring';
import { nanoid } from 'nanoid';
import { storeVideosToDb } from './video-api';

export interface BroadcastRaw {
  broadcastId: string;
  thumbnailUrl: string;
  youtubePlaylistIds: string[];
  videoArray: string[];
  currentVideo: string;
  nextVideo: string;
}

// Function that processes playlists using YouTube API
export const convertPlaylist = async (isReversed: boolean, youtubePlaylists: string) => {
  // Variable to save playlist thumbnail url
  let imageUrl = 'No thumbnail';

  // Get all YouTube video ids from playlists
  const getVidIds = async (playlists: string[]) => {
    // Return array of video ids from each playlist URL
    const playlistVideoArray = await Promise.all(playlists.map(async (playlistUrl) => {
      let parsedUrl = url.parse(playlistUrl);
      let parsedQs = querystring.parse(parsedUrl.query || ''); // Parse playlist URL to get playlist id
      // Call YouTube API to get all Ids
      const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=' + parsedQs.list + '&key=' + process.env.YT_API_KEY);
      const youtubeJSON = await response.json();
      const array: string[] = youtubeJSON.items.map((video: any) => {
        return video.snippet.resourceId.videoId;
      });

      // Save first video thumbnail as playlist thumbnail
      // If thumnail resolution does not exist, use the next avalible size
      if (youtubeJSON.items[0].snippet.thumbnails.maxres) imageUrl = youtubeJSON.items[0].snippet.thumbnails.maxres.url;
      else if (youtubeJSON.items[0].snippet.thumbnails.standard) imageUrl = youtubeJSON.items[0].snippet.thumbnails.standard.url;
      else if (youtubeJSON.items[0].snippet.thumbnails.high) imageUrl = youtubeJSON.items[0].snippet.thumbnails.high.url;

      // Return array of ids
      return array;
    }));
    // Return array of arrays coontaining video ids
    return playlistVideoArray.flat();
  };

  // Convert playlist string to array of playlists and remove whitespaces
  const escapedyoutubePlaylists = youtubePlaylists.replace(/\s/g, '').split(',');
  // Get video array
  const playlistVideoArray = await getVidIds(escapedyoutubePlaylists);
  // Reverse video-order per user setting
  if ( isReversed === true ) playlistVideoArray.reverse();
  // Store all YouTube videos in DB
  await storeVideosToDb(playlistVideoArray);
  // Crate new unique broadcast id
  const id = nanoid();
  // Save relevant data in broadcast object
  const broadcast: BroadcastRaw = {
    broadcastId: id,
    thumbnailUrl: imageUrl,
    youtubePlaylistIds: escapedyoutubePlaylists,
    videoArray: playlistVideoArray,
    currentVideo: playlistVideoArray[0],
    nextVideo: playlistVideoArray[1],
  };

  // Return broadcast object
  return broadcast;
};
