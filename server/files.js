const express = require("express");
const app = express();
const router = express.Router();

const fileUpload = require("express-fileupload");
const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;
const withAuth = require("./middleware");

app.set("files", path.join(__dirname, "data", "files"));

router.use(fileUpload());

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /files${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.post("/:id", withAuth, async (req, res, next) => {
	let filesId = {};
	const dirPath = path.join(app.get("files"), req.username, `story_${req.params.id}`);
	try {
		await fsp.mkdir(dirPath, {recursive: true})
	} catch(e) {
		next(e);
	}

	const filesToUpload = Object.entries(req.files).map(([key, value]) => {
		const fileId = uuidv4();
		filesId = { ...filesId, [key]: fileId };
		return value.mv(path.join(dirPath, fileId + "." + value.mimetype.split("/")[1]));
	});
	Promise.all(filesToUpload)
		.then((val) => {
			res.set("Content-Type", "application/json");
			res.send(JSON.stringify(filesId));
		})
		.catch(next);
});

router.get("/:id/:name", withAuth, (req, res) => {
	const filePath = path.join(app.get("files"), req.username, `story_${req.params.id}`);
	res.sendFile(path.join(filePath, req.params.name));
});

module.exports = router;
