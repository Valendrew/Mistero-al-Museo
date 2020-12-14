const fs = require('fs');
const util = require('util');
const path = require('path');
const json_spaces = 4;

const promiseRead = util.promisify(fs.readFile);
const promiseWrite = util.promisify(fs.writeFile);
const promiseAccess = util.promisify(fs.access);
const promiseMkdir = util.promisify(fs.mkdir);
const promiseReaddir = util.promisify(fs.readdir);
//const promiseRm = util.promisify(fs.rm);

const methods = {
	read: function readFile(filePath, dirPath, encoding = 'utf-8') {
		const dataPath = path.join(dirPath, filePath);
		return promiseRead(dataPath, encoding)
			.then(data => JSON.parse(data))
			.catch(e => {
				throw new Error(e);
			});
	},

	write: async function writeFile(data, filePath, dirPath, encoding = 'utf-8') {
		const dataPath = path.join(dirPath, filePath);
		try {
			await promiseAccess(dirPath);
		} catch (e) {
			await promiseMkdir(dirPath, { recursive: true });
		}
		return promiseWrite(dataPath, JSON.stringify(data, null, json_spaces), encoding);
	},

	readAll: async function readFilesInFolder(dirPath, encoding = 'utf-8') {
		let files;
		try {
			files = await promiseReaddir(dirPath, encoding);
		} catch (e) {
			throw new Error(e);
		}
		return files.map(file => methods.read(file, dirPath));
	},

	remove: async function removeFle(path, force = true) {
		return promiseRm(path, { force: force });
	}
};

module.exports = methods;
