const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const jsonParser = express.json();
const dataPath = path.join(__dirname, "data");

const readFile = (callback, user, id, filePath = dataPath, encoding = "utf8") => {
	const paraPath = `${path.join(filePath, user)}/story_${id}.json`;
	fs.readFile(paraPath, encoding, (err, data) => {
		if (err) {
			throw err;
		}
		callback(JSON.parse(data));
	});
};

const writeFile = (fileData, callback, user, id, filePath = dataPath, encoding = "utf8") => {
	const paraPath = `${path.join(filePath, user)}/story_${id}.json`;
	fs.writeFile(paraPath, fileData, encoding, (err) => {
		if (err) {
			throw err;
		}
		callback();
	});
};

async function readFilesInFolder(user, filePath = dataPath, encoding = "utf-8") {
	const dirPath = `${path.join(filePath, user)}`;
	const files = await fs.promises.readdir(dirPath, encoding);
	let data = [];
	files.forEach((file) => {
		const filePath = path.join(dirPath, file);
		data.push(readFilePromise(filePath));
	});
	return data;
}

const readFilePromise = (path, encoding = "utf-8") => {
	return fs.promises.readFile(path, encoding).then((data) => JSON.parse(data));
};

router.use((req, res, next) => {
	console.log(`Request ${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
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

router.get("/", async (req, res) => {
	Promise.all(await readFilesInFolder(res.locals.user)).then((values) => {
		res.send(values);
	});
});

router.get("/:id", (req, res) => {
	readFile(
		(data) => {
			res.send(data);
		},
		res.locals.user,
		req.params["id"]
	);
});

router.get("/:id/activities", (req, res) => {
	const parameters = { user: res.locals.user, id: req.params["id"] };
	readFile(
		(data) => {
			res.send(data["activities"]);
		},
		res.locals.user,
		req.params["id"]
	);
});

router.get("/:id/missions", (req, res) => {
	readFile(
		(data) => {
			res.send(data["missions"]);
		},
		res.locals.user,
		req.params["id"]
	);
});

router.get("/:id/transitions", (req, res) => {
	readFile(
		(data) => {
			res.send(data["transitions"]);
		},
		res.locals.user,
		req.params["id"]
	);
});

router.post("/:id/missions", jsonParser, (req, res) => {
	readFile(
		(data) => {
			data["missions"] = req.body;

			writeFile(
				JSON.stringify(data, null, 4),
				() => {
					res.status(201).send("new missions added");
				},
				res.locals.user,
				req.params["id"]
			);
		},
		res.locals.user,
		req.params["id"]
	);
});

router.post("/:id/transitions", jsonParser, (req, res) => {
	readFile(
		(data) => {
			data["transitions"] = req.body;

			writeFile(
				JSON.stringify(data, null, 4),
				() => {
					res.status(201).send("new transitions added");
				},
				res.locals.user,
				req.params["id"]
			);
		},
		res.locals.user,
		req.params["id"]
	);
});

module.exports = router;
