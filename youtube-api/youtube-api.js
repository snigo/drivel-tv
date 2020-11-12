
// Barebones of YouTube API helper function
exports.convertPlaylist = async (isReversed, youtubePlaylists) => {

  const broadcast = {
    broadcastId: 'xyz123',
    thumbnailUrl: 'https://i3.ytimg.com/vi/erLk59H86ww/hqdefault.jpg',
    youtubePlaylistIds: youtubePlaylists,
    videoArray: ['BgAlQuqzl8o', 'z5EoZ8urT0g', 'U9t-slLl30E'],
    currentVideo: 'BgAlQuqzl8o',
    currentVideoLength: 10,
    currentVideoTime: 0,
    nextVideo: 'z5EoZ8urT0g',
    nextVideoLength: 15
  };

  return broadcast;

};
