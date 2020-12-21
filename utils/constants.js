module.exports = {
  PAGE_SIZE_PLAYLISTS: 20,
  PAGE_SIZE_VIDEOS: 20,
  DEFAULT_OPTIONS: {
    channelId: null,
    debug: false,
    playlistId: null,
    googleApiToken: null,
    videoParts: ["snippet, statistics, contentDetails"],
    updateVideo: (video) => video,
  },
}
