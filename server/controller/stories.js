const express = require('express');
const router = express.Router();
const path = require('path');
const uuidv4 = require('uuid').v4;
const withAuth = require('./withAuth');
const fileOperations = require('./methods');

const app = express();
app.set('stories', path.join(__dirname, '..', 'data', 'stories'));
router.use(express.json());
router.use(express.text());
router.use(withAuth);

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /stories${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

/* RICHIESTE GET A /stories */
async function getHandler(req, res, next) {
	const { dirPath, id, type, value } = res.locals;
	fileOperations
		.read(`story_${id}.json`, path.join(dirPath, req.username))
		.then(data => res.send(type ? (value ? data[type][value] : data[type]) : data))
		.catch(next);
}

router.get('/', async (req, res, next) => {
	const userDir = path.join(app.get('stories'), req.username);
	let promises;
	try {
		promises = await fileOperations.readAll(userDir);
	} catch (e) {
		next(e);
	}
	Promise.all(promises)
		.then(values => {
			res.send(values);
		})
		.catch(next);
});

router.get(
	'/:id',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id };
		next();
	},
	getHandler
);

router.get(
	'/:id/activities',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'activities' };
		next();
	},
	getHandler
);

router.get(
	'/:id/activities/:name',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'activities', value: req.params.name };
		next();
	},
	getHandler
);

router.get(
	'/:id/missions',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'missions' };
		next();
	},
	getHandler
);

router.get(
	'/:id/transitions',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'transitions' };
		next();
	},
	getHandler
);

/* RICHIESTE POST A /stories */
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
			res.set('Content-Type', 'application/json');
			res.status(201).send({ status: `new ${type} added`, id: id });
		})
		.catch(next);
}

router.post(
	'/',
	async (req, res, next) => {
		const userDir = path.join(app.get('stories'), req.username);
		const id = uuidv4();
		req.body = { ...req.body, id: id };
		res.locals = { dirPath: app.get('stories'), id: id, type: 'info' };
		next();
	},
	postHandler
);

router.post('/:id', async (req, res, next) => {
	const userDir = path.join(app.get('stories'), req.username);

	let data;
	try {
		data = await fileOperations.read(`story_${req.params.id}.json`, userDir);
	} catch (e) {
		next(e);
	}

	const id = uuidv4();
	data.info.id = id;
	delete data.info.qr;

	fileOperations
		.write(data, `story_${id}.json`, userDir)
		.then(() => res.send('stories copied'))
		.catch(next);
});

router.post(
	'/:id/activities/:name',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'activities', value: req.params.name };
		next();
	},
	postHandler
);

router.post(
	'/:id/missions',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'missions' };
		next();
	},
	postHandler
);

router.post(
	'/:id/transitions',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'transitions' };
		next();
	},
	postHandler
);

router.post(
	'/:id/qrcode',
	async (req, res, next) => {
		const storyCode = req.params.id;
		let data;
		try {
			data = await fileOperations.read('stories.json', app.get('stories'));
		} catch (e) {
			data = {};
			console.log(e.message);
		}
		data[storyCode] = { user: req.username };
		try {
			await fileOperations.write(data, 'stories.json', app.get('stories'));
		} catch (e) {
			next(e);
		}
		req.body = `http://localhost:3000/player/${storyCode}`;
		res.locals = { dirPath: app.get('stories'), id: storyCode, type: 'info', value: 'qr' };
		next();
	},
	postHandler
);

router.put(
	'/:id/name',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'info', value: 'name' };
		next();
	},
	postHandler
);

router.put(
	'/:id/description',
	(req, res, next) => {
		res.locals = { dirPath: app.get('stories'), id: req.params.id, type: 'info', value: 'description' };
		next();
	},
	postHandler
);

/* RICHIESTE DELETE A /stories */
async function deleteHandler(req, res, next) {
	const userDir = path.join(app.get('stories'), req.username);
	const storyFile = `story_${req.params.id}.json`;

	let data;
	try {
		data = await fileOperations.read(storyFile, userDir);
	} catch (e) {
		next(e);
	}

	delete data[res.locals.key];

	fileOperations
		.write(data, storyFile, userDir)
		.then(() => res.send(res.locals.key + ' removed'))
		.catch(next);
}

router.delete('/:id', (req, res, next) => {
	const storyPath = path.join(app.get('stories'), req.username, `story_${req.params.id}.json`);

	fileOperations
		.remove(storyPath)
		.then(() => {
			res.send('story removed');
		})
		.catch(next);
});

router.delete('/:id/qrcode', async (req, res, next) => {
	const userDir = path.join(app.get('stories'), req.username);
	const storyCode = req.params.id;
	const storyFile = `story_${storyCode}.json`;
	let data;
	try {
		data = await fileOperations.read(storyFile, userDir);
	} catch (e) {
		next(e);
	}
	delete data.info.qr;
	try {
		await fileOperations.write(data, storyFile, userDir);
	} catch (e) {
		next(e);
	}
	try {
		data = await fileOperations.read('stories.json', app.get('stories'));
	} catch (e) {
		next(e);
	}
	delete data[storyCode];

	fileOperations
		.write(data, 'stories.json', app.get('stories'))
		.then(() => res.send('qrcode removed'))
		.catch(next);
});

router.delete(
	'/:id/missions',
	async (req, res, next) => {
		res.locals.key = 'missions';
		next();
	},
	deleteHandler
);

router.delete(
	'/:id/transitions',
	async (req, res, next) => {
		res.locals.key = 'transitions';
		next();
	},
	deleteHandler
);

module.exports = router;
