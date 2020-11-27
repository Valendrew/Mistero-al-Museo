const express = require('express');
const path = require('path');
const uuidv4 = require('uuid').v4;
const uuidValidate = require('uuid').validate;
const EventEmitter = require('events');
const fileOperations = require('./methods');

const app = express();
const router = express.Router();
app.set('games', path.join(__dirname, '..', 'data', 'games'));
app.set('stories', path.join(__dirname, '..', 'data', 'stories'));

router.use(express.json());
router.use(express.text());

const emitter = new EventEmitter();

const updateStatusPlayer = async (req, res, next) => {
	const playerID = res.locals.playerID;
	const toEmit = res.locals.emitName;
	const storyID = req.params.id;

	const newDateActivity = req.params.name ? {} : { dateActivity: new Date() };

	let data;
	try {
		data = await fileOperations.read('player.json', app.get('games'));
		data[storyID][playerID] = { ...data[storyID][playerID], ...req.body, ...newDateActivity };
	} catch (e) {
		next(e);
	}

	fileOperations
		.write(data, 'player.json', app.get('games'))
		.then(() => {
			toEmit ? emitter.emit(toEmit, { player: playerID, story: storyID }) : null;
			res.send('status updated');
		})
		.catch(next);
};

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /games${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

router.get('/status', (req, res, next) => {
	emitter.once('status', data => {
		res.send(data);
	});
});

/*usato da valutatore*/
router.get('/answer', async (req, res, next) => {
	emitter.once('answer', data => {
		res.send(data);
	});
});

router.get('/chat', async (req, res, next) => {
	emitter.once('chat', data => {
		res.send(data);
	});
});

router.get('/:id', async (req, res, next) => {
	const uuidParam = req.params.id;
	let data, stories;
	if (uuidValidate(uuidParam)) {
		try {
			stories = await fileOperations.read('stories.json', app.get('stories'));
		} catch (e) {
			next(e);
		}
	}
	const { user } = stories[uuidParam];
	if (user) {
		const storyPath = path.join(app.get('stories'), user);
		let storyObject, startTransition;
		try {
			storyObject = await fileOperations.read(`story_${uuidParam}.json`, storyPath);
			startTransition = Math.floor(Math.random() * Object.keys(storyObject.transitions).length);
		} catch (e) {
			next(e);
		}
		const date = new Date();
		const playerValues = {
			state: 'start',
			name: 'player',
			transition: startTransition,
			dateStart: date,
			dateActivity: date
		};
		const playerId = uuidv4();

		try {
			data = await fileOperations.read('player.json', app.get('games'));
		} catch (e) {
			data = {};
			console.log(e.message);
		}
		data[uuidParam] = { ...data[uuidParam], [playerId]: playerValues };
		fileOperations
			.write(data, 'player.json', app.get('games'))
			.then(() => {
				res.cookie('playerId', playerId, { httpOnly: true }, { maxAge: '3h' });
				res.send({ story: storyObject, status: playerValues });
			})
			.catch(next);
	} else {
		res.status(404).send('Storia non valida');
	}
});

router.get('/:id/players', async (req, res, next) => {
	const storyID = req.params.id;
	let result;
	try {
		result = await fileOperations.read('player.json', app.get('games'));
	} catch (e) {
		result = {};
	}
	res.send(result[storyID]);
});

router.get('/:id/players/:name', async (req, res, next) => {
	const storyID = req.params.id;
	const playerID = req.params.name;

	let result;
	try {
		result = await fileOperations.read('player.json', app.get('games'));
		res.send(result[storyID][playerID]);
	} catch (e) {
		next();
	}
});

/* Usata dal player */
router.put(
	'/:id/players',
	(req, res, next) => {
		res.locals.playerID = req.cookies.playerId;
		res.locals.emitName = "status";
		next();
	},
	updateStatusPlayer
);

/* Usata dal valutatore */
router.put(
	'/:id/players/:name',
	(req, res, next) => {
		res.locals.playerID = req.params.name;
		res.locals.emitName = null;
		next();
	},
	updateStatusPlayer
);

/*usato da player*/
router.put('/:id/answer', (req, res, next) => {
	res.locals.playerID = req.cookies.playerId;
	res.locals.emitName = "answer";
	next();
}, updateStatusPlayer);

router.put('/:id/message/:name', (req, res, next)=>{
	console.log(req.body);
	res.locals.playerID=req.params.name;
	res.locals.emitName = "chat";
	next();
}, updateStatusPlayer);

router.put('/:id/message', (req, res, next)=>{
	console.log(req.body);
	res.locals.playerID=req.cookies.playerId;
	res.locals.emitName = "chat";
	next();
}, updateStatusPlayer);

/* DUE RICHIESTE PER INVIARE LA RISPOSTA 
 post = fatta dal player,
 get = fatta dal valutatore */

/* DUE RICHIESTE PER INVIARE LA CORREZIONE
  post = fatta dal valutatore
  get = fatta dal player */

/* PLAYER: post -> /games/question ---> get -> /games/correzione */
/* VALUTATORE: get -> /games/question ---> get -> /games/question
	
	onSubmit -> post /games/correzione  ---> get -> /games/question */

module.exports = router;
