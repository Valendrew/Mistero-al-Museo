const express = require("express");
const fsp = require("fs").promises;
const path = require("path");
const uuidv4 = require("uuid").v4;
const withAuth = require('./middleware');

const app = express();
app.set("json spaces", 4);
app.set("path", path.join(__dirname, "data", "stories"));

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
	console.log(`Request ${req.method} at /story${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

/*router.use((req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: "No credentials sent!" });
	}
	const b64auth = req.headers.authorization.split(" ")[1];
	req.username = Buffer.from(b64auth, "base64").toString().split(":")[0];
	next();
});*/

router.get("/",withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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

router.get("/:id", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data))
		.catch(next);
});

router.get("/:id/activities", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.activities))
		.catch(next);
});

router.get("/:id/missions", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.missions))
		.catch(next);
});

router.get("/:id/transitions", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	readFile(storyFile, userDir)
		.then((data) => res.send(data.transitions))
		.catch(next);
});

router.post("/:id/missions", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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

router.post("/:id/transitions", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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

router.put("/:id/name", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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

router.put("/:id/description", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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

router.post("/:id/qrcode", withAuth, async (req, res, next) => {
	const storyCode = uuidv4();
	const userDir = path.join(app.get("path"), req.username);
	const storyFile = `story_${req.params.id}.json`;
	let data;
	try {
		data = await readFile("stories.json");
	} catch (e) {
		data = {};
		console.log("Read file error: " + e.message);
	}
	data[storyCode] = { user: req.username, story: req.params.id };
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

router.delete("/:id/qrcode", withAuth, async (req, res, next) => {
	const userDir = path.join(app.get("path"), req.username);
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


router.post("/file",(req,res) => {
	const fileName = req.files.myFile.name;
	const path = __dirname + "/data/user_1/media/" + fileName;
	const file = req.files.myFile;
	file.mv(path, (error)=>{
		if(error){
			console.log(error);
			res.writeHead(500, {
				'Content-Type': 'application/json'
			  });
			  res.end(JSON.stringify({ status: 'error', message: error }, null, app.get("json spaces")));
			  return;
		}
	});
});


router.get("/file/:file_name",(req,res)=>{
	const image_name = req.params["file_name"];
	res.sendFile(__dirname + "/data/user1/media/"+image_name);
});

router.post("/activity/:story_name/:activity_number", async (req, res, next) => {
	const userDir = path.join(app.get("path"), "user_1");
	const storyFile = `story_${req.params["story_name"]}.json`;
	let data;
	try {
		data = await readFile(storyFile, userDir);
	} catch (e) {
		data = {};
		console.log("Read file error: " + e.message);
	}
	data["activities"] = {...data["activities"], [req.params["activity_number"]]: req.body};
	writeFile(storyFile, data, userDir)
		.then(() => res.status(201).send("new activity added"))
		.catch(next);

});

module.exports = router;
