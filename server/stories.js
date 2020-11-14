const express = require("express");
const app = express();
const router = express.Router();

const path = require("path");
const uuidv4 = require("uuid").v4;
const withAuth = require("./middleware");
const fileOperations = require("./methods");

app.set("stories", path.join(__dirname, "data", "stories"));

router.use(express.json());
router.use(express.text());

async function getHandler(req, res, next) {
	const { dirPath, id, type } = res.locals;
	fileOperations
		.read(`story_${id}.json`, path.join(dirPath, req.username))
		.then((data) => res.send(type ? data[type] : data))
		.catch(next);
}

async function postHandler(req, res, next) {
	const { dirPath, id, type, value } = res.locals;
	const userDir = path.join(dirPath, req.username);
	const storyFile = `story_${id}.json`;
	let data;

	try {
		data = await fileOperations.read(storyFile, userDir);
	} catch (e) {
		data = {};
		console.log(e.message);
	}
	if (value) data[type] = { ...data[type], [value]: req.body };
	else data[type] = req.body;

	fileOperations
		.write(data, storyFile, userDir)
		.then(() => {
			res.set("Content-Type", "application/json");
			res.status(201).send({ status: `new ${type} added`, id: id });
		})
		.catch(next);
}

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /stories${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.get("/", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("stories"), req.username);
	let promises;
	try {
		promises = await fileOperations.readAll(userDir);
	} catch (e) {
		next(e);
	}
	Promise.all(promises)
		.then((values) => {
			res.send(values);
		})
		.catch(next);
});

router.get(
	"/:id",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id };
		next();
	},
	getHandler
);

router.get(
	"/:id/activities",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "activities" };
		next();
	},
	getHandler
);

router.get(
	"/:id/missions",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "missions" };
		next();
	},
	getHandler
);

router.get(
	"/:id/transitions",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "transitions" };
		next();
	},
	getHandler
);

router.post(
	"/",
	withAuth,
	async (req, res, next) => {
		const userDir = path.join(app.get("stories"), req.username);
		let fileInDir;
		try {
			fileInDir = await fileOperations.readAll(userDir);
		} catch (e) {
			fileInDir = [];
			console.log(e.message);
		}
		const id = fileInDir.length + 1;
		req.body = { ...req.body, id: id };
		res.locals = { dirPath: app.get("stories"), id: id, type: "info" };
		next();
	},
	postHandler
);

router.post(
	"/:id/activities/:name",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "activities", value: req.params.name };
		next();
	},
	postHandler
);

router.post(
	"/:id/missions",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "missions" };
		next();
	},
	postHandler
);

router.post(
	"/:id/transitions",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "transitions" };
		next();
	},
	postHandler
);

router.post(
	"/:id/qrcode",
	withAuth,
	async (req, res, next) => {
		const storyCode = uuidv4();
		let data;
		try {
			data = await fileOperations.read("stories.json", app.get("stories"));
		} catch (e) {
			data = {};
			console.log(e.message);
		}
		data[storyCode] = { user: req.username, story: req.params.id };
		try {
			await fileOperations.write(data, "stories.json", app.get("stories"));
		} catch (e) {
			next(e);
		}
		req.body = `http://localhost:3000/player/${storyCode}`;
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "info", value: "qr" };
		next();
	},
	postHandler
);

router.put(
	"/:id/name",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "info", value: "name" };
		next();
	},
	postHandler
);

router.put(
	"/:id/description",
	withAuth,
	(req, res, next) => {
		res.locals = { dirPath: app.get("stories"), id: req.params.id, type: "info", value: "description" };
		next();
	},
	postHandler
);

router.delete("/:id/qrcode", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("stories"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await fileOperations.read(storyFile, userDir);
	} catch (e) {
		next(e);
	}
	const storyCode = data.info.qr.split("/").reverse()[0];
	delete data.info.qr;
	try {
		await fileOperations.write(data, storyFile, userDir);
	} catch (e) {
		next(e);
	}
	try {
		data = await fileOperations.read("stories.json", app.get("stories"));
	} catch (e) {
		next(e);
	}
	delete data[storyCode];
	
	fileOperations
		.write(data, "stories.json", app.get("stories"))
		.then(() => res.send("new name added"))
		.catch(next);
});

module.exports = router;
