<div align="center">
  <h1>gatsby-source-youtube</h1>
  <br/>
  <p>
    <img src="./logo.png" alt="gatsby-source-youtube" height="100px">
  </p>
  <br/>

[![Npm version][badge-npm]][npm]
[![Npm downloads][badge-npm-dl]][npm]
[![MIT license][badge-licence]](./LICENCE.md)
[![PRs welcome][badge-prs-welcome]](#contributing)

</div>

---

`gatsby-source-youtube` is a [Gatsby](https://www.gatsbyjs.org/) plugin to use [Youtube](https://www.youtube.com/) as a data source.

## Usage

1. Download `jorge-d/gatsby-source-youtube`

```shell
yarn add jorge-d/gatsby-source-youtube
```

2. Get your token from Google console

3. Add the plugin in your `gatsby-config.js` file

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-youtube",
      options: {
        // All options are optional
        // By default, it will fetch videos from your playlists
        //
        // Comma-separated list of the YouTube channel ID(s)
        channelId: "AFD...dfgDF",
        // Comma-separated list of the YouTube playlist ID(s)
        playlistId: "AFD...dfgDF",
        // Token is required
        googleApiToken: process.env.GOOGLE_YOUTUBE_TOKEN
        // defaults to ["snippet, statistics, contentDetails"]
        videoParts: ["snippet, statistics, contentDetails"]
        // To update video:
        updateVideo: (video) => {
          const countryTag = video.tags.find((tag) => tag.startWith("country"))

          if (countryTag) {
            const [, country] = video.title.split(":")
            return {
              ...video,
              country,
            }
          }

          return video
        },
        // For a better stack trace and more information
        debug: true,
      },
    },
    // Recommanded to use with gatsby-image
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
  ],
}
```

## Showcase

You are using `gatsby-source-youtube` for your website?
Thank you!

Please add your website to the [Showcase](./showcase.yml)

## Contributing

- ⇄ Pull/Merge requests and ★ Stars are always welcome.
- For bugs and feature requests, please [create an issue][github-issue].

## Changelog

See [CHANGELOG](./CHANGELOG.md)

## License

This project is licensed under the MIT License - see the
[LICENCE](./LICENCE.md) file for details

[badge-npm]: https://img.shields.io/npm/v/gatsby-source-youtube.svg?style=flat-square
[badge-npm-dl]: https://img.shields.io/npm/dt/gatsby-source-youtube.svg?style=flat-square
[badge-licence]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[npm-badge]: https://img.shields.io/npm/v/gatsby-source-youtube.svg?style=flat-square
[npm]: https://www.npmjs.org/package/gatsby-source-youtube
[github-issue]: https://github.com/cedricdelpoux/gatsby-source-youtube/issues/new
