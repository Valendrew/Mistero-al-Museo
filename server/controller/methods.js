const fsp = require('fs').promises;
const path = require('path');
const json_spaces = 4;

const methods = {
	read: function readFile(filePath, dirPath, encoding = 'utf-8') {
		const dataPath = path.join(dirPath, filePath);
		return fsp
			.readFile(dataPath, encoding)
			.then(data => JSON.parse(data))
			.catch(e => {
				throw new Error(e);
			});
	},
	write: async function writeFile(data, filePath, dirPath, encoding = 'utf-8') {
		const dataPath = path.join(dirPath, filePath);
		try {
			await fsp.access(dirPath);
		} catch (e) {
			await fsp.mkdir(dirPath, { recursive: true });
		}
		return fsp.writeFile(dataPath, JSON.stringify(data, null, json_spaces), encoding);
	},
	readAll: async function readFilesInFolder(dirPath, encoding = 'utf-8') {
		let files;
		try {
			files = await fsp.readdir(dirPath, encoding);
		} catch (e) {
			throw new Error(e);
		}
		return files.map(file => methods.read(file, dirPath));
	}
};

module.exports = methods;
