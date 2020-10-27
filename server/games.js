const express = require("express");
const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;
const uuidValidate = require("uuid").validate;
const EventEmitter = require("events");

const app = express();
app.set("json spaces", 4);
app.set("games path", path.join(__dirname, "data", "games"));
app.set("stories path", path.join(__dirname, "data", "stories"));

const router = express.Router();
router.use(express.json());
router.use(express.text());

const emitter = new EventEmitter();

async function readFile(filePath, dirPath = app.get("games path"), encoding = "utf-8") {
	const dataPath = path.join(dirPath, filePath);
	return fsp
		.readFile(dataPath, encoding)
		.then((data) => JSON.parse(data))
		.catch((e) => {
			throw new Error(e);
		});
}

async function writeFile(filePath, data, dirPath = app.get("games path"), encoding = "utf-8") {
	const dataPath = path.join(dirPath, filePath);
	try {
		await fsp.access(dirPath);
	} catch (e) {
		await fsp.mkdir(dirPath);
	}
	return fsp.writeFile(dataPath, JSON.stringify(data, null, app.get("json spaces")), encoding);
}

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /games${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
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

router.get("/:id", async (req, res, next) => {
	const uuidParam = req.params.id;
	let data, playerId;
	if (uuidValidate(uuidParam)) {
		try {
			const stories = await readFile("stories.json", app.get("stories path"));
			var { user, story } = stories[uuidParam];
		} catch (e) {
			next(e);
		}
	}
	playerId = uuidv4();
	try {
		data = await readFile(`player.json`);
	} catch (e) {
		data = {};
		console.log("Read error: " + e.message);
	}
	data[uuidParam] = { ...data[uuidParam], [playerId]: { status: "start" } };

	const storyPath = path.join(app.get("stories path"), user);
	Promise.all([writeFile("player.json", data), readFile(`story_${story}.json`, storyPath)])
		.then((values) => {
			res.send({ story: values[1], player: playerId });
		})
		.catch(next);
});

router.get("/:id/help", async (req, res, next) => {
	emitter.once("help", (msg) => {
		res.send(msg);
	});
});

router.post("/:id/help", async (req, res, next) => {
	emitter.emit("help", req.body);
	res.send("message sent");
});
module.exports = router;
