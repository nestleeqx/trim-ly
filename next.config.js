const path = require('path')

const stylesPath = path.join(process.cwd(), 'app', 'styles')

module.exports = {
	sassOptions: {
		includePaths: [stylesPath],
		loadPaths: [stylesPath]
	}
}
