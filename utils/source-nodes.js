const {google} = require("googleapis")

const {handleCover} = require("./handle-cover")
const {
  DEFAULT_OPTIONS,
  PAGE_SIZE_PLAYLISTS,
  PAGE_SIZE_VIDEOS,
} = require("./constants")

exports.sourceNodes = async (
  {
    actions: {createNode},
    createContentDigest,
    reporter,
    store,
    cache,
    createNodeId,
  },
  pluginOptions
) => {
  const options = {...DEFAULT_OPTIONS, ...pluginOptions}

  if (!options.googleApiToken) throw "Missing googleApiToken"

  try {
    // TODO: use configurable var
    const youtube = google.youtube({
      version: "v3",
      auth: options.googleApiToken,
    })

    const playlists = []

    let nextPageToken
    let page = 1

    const timerPlaylistsFetching = reporter.activityTimer(
      `source-youtube: Fetching playlists`
    )

    if (options.debug) {
      timerPlaylistsFetching.start()
    }

    const channelFilter = {channelId: options.channelId}
    const playlistFilter = {id: options.playlistId}
    const mineFilter = {mine: true}
    const filter = options.playlistId
      ? playlistFilter
      : options.channelId
      ? channelFilter
      : mineFilter

    do {
      const {data} = await youtube.playlists.list({
        part: ["snippet"],
        maxResults: PAGE_SIZE_PLAYLISTS,
        pageToken: nextPageToken,
        ...filter,
      })

      playlists.push(...data.items)

      if (options.debug) {
        timerPlaylistsFetching.setStatus(
          `${playlists.length} playlists found in ${page * PAGE_SIZE_PLAYLISTS}`
        )
      }

      page++

      nextPageToken = data.nextPageToken
    } while (nextPageToken)

    if (options.debug) {
      timerPlaylistsFetching.end()
    }

    for (const playlist of playlists) {
      const timerVideosFetching = reporter.activityTimer(
        `source-youtube: Fetching ${playlist.snippet.title} videos`
      )
      const videos = []
      let nextPageToken

      if (options.debug) {
        timerVideosFetching.start()
      }

      do {
        const {data: playlistData} = await youtube.playlistItems.list({
          part: ["snippet,contentDetails"],
          maxResults: PAGE_SIZE_VIDEOS,
          playlistId: playlist.id,
          pageToken: nextPageToken,
        })

        const videosIds = playlistData.items
          .map((item) => item.contentDetails.videoId)
          .join(",")

        const {data} = await youtube.videos.list({
          part: options.videoParts,
          maxResults: PAGE_SIZE_VIDEOS,
          id: videosIds,
        })

        videos.push(...data.items)

        if (options.debug) {
          timerVideosFetching.setStatus(`${videos.length} videos`)
        }

        nextPageToken = data.nextPageToken
      } while (nextPageToken)

      if (options.debug) {
        timerVideosFetching.end()
      }

      await handleCover({
        node: playlist,
        createNode,
        store,
        cache,
        createNodeId,
        reporter,
      })

      createNode({
        id: playlist.id,
        ...playlist.snippet,
        videos: videos.map((video) => video.id),
        internal: {
          type: "YoutubePlaylist",
          contentDigest: createContentDigest(playlist),
        },
      })

      for (let {snippet, statistics, ...fields} of videos) {
        Object.keys(statistics).map((key) => {
          statistics[key] = Number(statistics[key])
        })

        const video = options.updateVideo({
          ...fields,
          ...snippet,
          statistics,
        })

        await handleCover({
          node: video,
          createNode,
          store,
          cache,
          createNodeId,
          reporter,
        })

        createNode({
          ...video,
          playlist: playlist.id,
          internal: {
            type: "YoutubeVideo",
            contentDigest: createContentDigest(video),
          },
        })
      }
    }

    return
  } catch (e) {
    if (pluginOptions.debug) {
      reporter.panic(`source-youtube: `, e)
    } else {
      reporter.panic(`source-youtube: ${e.message}`)
    }
  }
}
