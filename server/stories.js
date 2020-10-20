const express = require("express");
const fs = require("fs");
const router = express.Router();
const jsonParser = express.json();

const dataPath = "./data/user_1/";

const readFile = (callback, param, filePath = dataPath, encoding = "utf8") => {
	const paraPath = `${filePath}/story_${param}.json`;
	fs.readFile(paraPath, encoding, (err, data) => {
		if (err) {
			throw err;
		}
		callback(JSON.parse(data));
	});
};

const writeFile = (fileData, callback, param, filePath = dataPath, encoding = "utf8") => {
	const paraPath = `${filePath}/story_${param}.json`;
	fs.writeFile(paraPath, fileData, encoding, (err) => {
		if (err) {
			throw err;
		}
		callback();
	});
};

router.use((req, res, next) => {
	console.log(`Request ${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.get("/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		res.send(data);
	}, idParam);
});

router.get("/activities/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		res.send(data["activities"]);
	}, idParam);
});

router.get("/missions/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		res.send(data["missions"]);
	}, idParam);
});

router.get("/transitions/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		res.send(data["transitions"]);
	}, idParam);
});

router.post("/missions/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		data["missions"] = req.body;

		writeFile(
			JSON.stringify(data, null, 4),
			() => {
				res.status(201).send("new missions added");
			},
			idParam
		);
	}, idParam);
});

router.post("/transitions/:id", jsonParser, (req, res) => {
	const idParam = req.params["id"];
	readFile((data) => {
		data["transitions"] = req.body;

		writeFile(
			JSON.stringify(data, null, 2),
			() => {
				res.status(201).send("new missions added");
			},
			idParam
		);
	}, idParam);
});

module.exports = router;
