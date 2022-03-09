module.exports = {
  plugins: [
    {
      //resolve: "gatsby-source-youtube"
      resolve: require.resolve(`..`),
      options: {
        googleApiToken: process.env.GOOGLE_YOUTUBE_TOKEN,
        channelId: "UCpEfF_Jfp0SozH6uZ0PNw5Q",
        debug: true,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
  ],
}
