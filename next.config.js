/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')

const stylesPath = path.join(process.cwd(), 'app', 'styles')

module.exports = {
	sassOptions: {
		includePaths: [stylesPath],
		loadPaths: [stylesPath]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.yandex.net'
			},
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
			{ protocol: 'https', hostname: 'cdn2.iconfinder.com' },
			{ protocol: 'https', hostname: '**.blob.vercel-storage.com' }
		]
	}
}
