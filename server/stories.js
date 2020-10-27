const express = require("express");
const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;

const app = express();
app.set("json spaces", 4);
app.set("path", path.join(__dirname, "data"));

const router = express.Router();
router.use(express.json());
router.use(express.text());

async function readFile(filePath, dirPath = app.get("path"), encoding = "utf-8") {
	const dataPath = path.join(dirPath, filePath);
	return fsp
		.readFile(dataPath, encoding)
		.then((data) => JSON.parse(data))
		.catch((e) => {
			throw new Error(e);
		});
}

async function writeFile(filePath, data, dirPath = app.get("path"), encoding = "utf-8") {
	const dataPath = path.join(dirPath, filePath);
	try {
		await fsp.access(dirPath);
	} catch (e) {
		await fsp.mkdir(dirPath);
	}
	return fsp.writeFile(dataPath, JSON.stringify(data, null, app.get("json spaces")), encoding);
}

async function readFilesInFolder(dirPath = app.get("path"), encoding = "utf-8") {
	let files;
	try {
		files = await fsp.readdir(dirPath, encoding);
	} catch (e) {
		throw new Error(e);
	}
	return files.map((file) => readFile(file, dirPath));
}

router.use((req, res, next) => {
	console.log(`Request ${req.method} at ${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: "No credentials sent!" });
	}
	const b64auth = req.headers.authorization.split(" ")[1];
	res.locals.user = Buffer.from(b64auth, "base64").toString().split(":")[0];
	next();
});

router.get("/", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	let promises;
	try {
		promises = await readFilesInFolder(userDir);
	} catch (e) {
		next(e);
	}
	Promise.all(promises)
		.then((values) => {
			res.send(values);
		})
		.catch(next);
});

router.get("/:id", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data))
		.catch(next);
});

router.get("/:id/activities", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.activities))
		.catch(next);
});

router.get("/:id/missions", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.missions))
		.catch(next);
});

router.get("/:id/transitions", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.transitions))
		.catch(next);
});

router.post("/:id/missions", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		console.log("Read file error: " + e.message);
	}
	data.missions = req.body;
	writeFile(storyFile, data, userDir)
		.then(() => res.status(201).send("new missions added"))
		.catch(next);
});

router.post("/:id/transitions", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		console.log("Read file error: " + e.message);
	}
	data.transitions = req.body;
	writeFile(storyFile, data, userDir)
		.then(() => res.status(201).send("new transitions added"))
		.catch(next);
});

router.put("/:id/name", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let statusCode = 200;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		statusCode = 201;
		console.log("Read file error: " + e.message);
	}
	data.info.name = req.body;
	writeFile(storyFile, data, userDir)
		.then(() => res.status(statusCode).send("name edited"))
		.catch(next);
});

router.put("/:id/description", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let statusCode = 200;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		statusCode = 201;
		console.log("Read file error: " + e.message);
	}
	data.info.description = req.body;
	writeFile(storyFile, data, userDir)
		.then(() => res.status(statusCode).send("description edited"))
		.catch(next);
});

router.post("/:id/qrcode", async (req, res, next) => {
	const storyCode = uuidv4();
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await readFile("stories.json");
	} catch (e) {
		data = {};
		console.log("Read file error: " + e.message);
	}
	data[storyCode] = { user: res.locals.user, story: req.params.id };
	writeFile("stories.json", data)
		.then(() => console.log("added story to stories.json"))
		.catch(next);

	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		console.log(e.message);
	}
	data.info.qr = `http://localhost:3000/player/${storyCode}`;
	writeFile(storyFile, data, userDir)
		.then(() => res.status(201).send("new qrcode added"))
		.catch(next);
});

router.delete("/:id/qrcode", async (req, res, next) => {
	const userDir = path.join(app.get("path"), res.locals.user);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		next(e);
	}
	const storyCode = data.info.qr.split("/").reverse()[0];
	delete data.info.qr;
	writeFile(storyFile, data, userDir)
		.then(() => res.send("new name added"))
		.catch(next);

	try {
		data = await readFile("stories.json");
	} catch (e) {
		next(e);
	}
	delete data[storyCode];
	writeFile("stories.json", data)
		.then(() => console.log("removed story from stories.json"))
		.catch(next);
});

module.exports = router;
