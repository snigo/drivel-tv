
// Import fetch and modules to manipulate URLs
const fetch = require('node-fetch');
const url = require('url');
const querystring = require('querystring');


// Function that processes playlists using YouTube API
exports.convertPlaylist = async (isReversed, youtubePlaylists) => {

  // Get all YouTube video ids from playlists
  const getVidIds = async (playlists) => {
    // Return array of video ids from each playlist URL
    const playlistVideoArray = await Promise.all(playlists.map( async playlistUrl => {
      let parsedUrl = url.parse(playlistUrl);
      let parsedQs = querystring.parse(parsedUrl.query); // Parse playlist URL to get playlist id
      // Call YouTube API to get all Ids
      const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=' + parsedQs.list + '&key=' + process.env.YT_API_KEY);
      const youtubeJSON = await response.json();
      const array = await youtubeJSON.items.map( video => {
        return video.snippet.resourceId.videoId;
      });
      // Return array of ids
      return array;
    }));
    // Return array of arrays coontaining video ids
    return playlistVideoArray;
  };

  let playlistVideoArray = await getVidIds(youtubePlaylists);
  // Flatten the array of arrays, generating a complete list of video ids
  const flattenedVideoArray = [].concat(...playlistVideoArray);


  // Return if no videos in array
  if (flattenedVideoArray.length < 2) return;

  // Reverse video-order per user setting
  if ( isReversed === true ) flattenedVideoArray.reverse();


  const broadcast = {
    broadcastId: 'xyz123',
    thumbnailUrl: 'https://i3.ytimg.com/vi/erLk59H86ww/hqdefault.jpg',
    youtubePlaylistIds: youtubePlaylists,
    videoArray: flattenedVideoArray,
    currentVideo: flattenedVideoArray[0],
    currentVideoLength: 10,
    currentVideoTime: 0,
    nextVideo: flattenedVideoArray[1],
    nextVideoLength: 15
  };

  return broadcast;

};
