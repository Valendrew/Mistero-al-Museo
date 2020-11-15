const express = require("express");
const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;
const uuidValidate = require("uuid").validate;
const EventEmitter = require("events");
const fileOperations = require("./methods");

const app = express();
const router = express.Router();
app.set("games", path.join(__dirname, "..", "data", "games"));
app.set("stories", path.join(__dirname, "..", "data", "stories"));

router.use(express.json());
router.use(express.text());

const emitter = new EventEmitter();

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /games${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.get("/:id", async (req, res, next) => {
	const uuidParam = req.params.id;
	let data, stories;
	if (uuidValidate(uuidParam)) {
		try {
			stories = await fileOperations.read("stories.json", app.get("stories"));
		} catch (e) {
			next(e);
		}
	}
	const { user, story } = stories[uuidParam];
	if (user) {
		const storyPath = path.join(app.get("stories"), user);
		const playerId = uuidv4();
		const playerName = "player";
		const statusValue = "start";
		let storyObject, startTransition;
		try {
			storyObject = await fileOperations.read(`story_${story}.json`, storyPath);
			startTransition = Math.floor(Math.random() * Object.keys(storyObject.transitions).length);
		} catch (e) {
			next(e);
		}
		const playerValues = { status: statusValue, name: playerName, transition: startTransition };

		try {
			data = await fileOperations.read("player.json", app.get("games"));
		} catch (e) {
			data = {};
			console.log(e.message);
		}
		data[uuidParam] = { ...data[uuidParam], [playerId]: playerValues };
		fileOperations
			.write(data, "player.json", app.get("games"))
			.then(() => {
				res.cookie("playerId", playerId, { httpOnly: true }, { maxAge: "3h" });
				res.send({ story: storyObject, status: playerValues });
			})
			.catch(next);
	} else {
		res.status(404).send("Storia non valida");
	}
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
