const express = require("express");
const app = express();
const router = express.Router();

const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;
const uuidValidate = require("uuid").validate;
const EventEmitter = require("events");
const fileOperations = require("./methods");

app.set("games", path.join(__dirname, "data", "games"));
app.set("stories", path.join(__dirname, "data", "stories"));

router.use(express.json());
router.use(express.text());

const emitter = new EventEmitter();

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /games${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.get("/:id", async (req, res, next) => {
	const uuidParam = req.params.id;
	let data, playerId;
	if (uuidValidate(uuidParam)) {
		try {
			const stories = await fileOperations.read("stories.json", app.get("stories"));
			var { user, story } = stories[uuidParam];
		} catch (e) {
			next(e);
		}
	}
	playerId = uuidv4();
	try {
		data = await fileOperations.read("player.json", app.get("games"));
	} catch (e) {
		data = {};
		console.log(e.message);
	}
	data[uuidParam] = { ...data[uuidParam], [playerId]: { status: "start" } };

	const storyPath = path.join(app.get("stories"), user);
	Promise.all([fileOperations.write(data, "player.json", app.get("games")), fileOperations.read(`story_${story}.json`, storyPath)])
		.then((values) => {
			res.cookie("playerId", playerId, { maxAge: 2 * 60 * 60 * 1000 });
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
