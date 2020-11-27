const express = require('express');
const path = require('path');
const uuidv4 = require('uuid').v4;
const uuidValidate = require('uuid').validate;
const fileOperations = require('./methods');

const app = express();
app.set('games', path.join(__dirname, '..', 'data', 'games'));
app.set('stories', path.join(__dirname, '..', 'data', 'stories'));

const router = express.Router();
router.use(express.json());
router.use(express.text());

router.use((req, res, next) => {
	console.log(`Request ${req.method} at /games${req.path} on Time: ${new Date(Date.now()).toUTCString()}`);
	next();
});

/* Richieste per ottenere i player di una determinata storia */
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

const updateStatusPlayer = async (req, res, next) => {
	const playerID = res.locals.playerID;
	const storyID = req.params.id;
	const playerStatus = req.body;

	let data;
	try {
		data = await fileOperations.read('player.json', app.get('games'));
		if (data.hasOwnProperty(storyID)) {
			data[storyID][playerID] = { ...data[storyID][playerID], ...playerStatus };
		} else {
			data[storyID] = { [playerID]: playerStatus };
		}
	} catch (e) {
		next(e);
	}

	fileOperations
		.write(data, 'player.json', app.get('games'))
		.then(() => {
			res.send(res.locals.response || 'status updated');
		})
		.catch(next);
};

/* Richiesta per creare l'identità del player */
router.post(
	'/:id',
	async (req, res, next) => {
		/* Controllo se l'ID passato come parametro alla richiesta
		rispetta il formato uuid */
		const uuidParam = req.params.id;
		if (uuidValidate(uuidParam)) {
			/* Leggo il file contenente le informazioni di tutte le storie (id e user) */
			let storiesFile;
			try {
				storiesFile = await fileOperations.read('stories.json', app.get('stories'));
			} catch (e) {
				next(e);
			}

			/* Seleziono l'utente della storia selezionata, se esiste allora
			leggo il file contenente l'intera storia nella subdirectory dell'utente */
			const { user } = storiesFile[uuidParam];
			if (user) {
				/* Leggo il file relativo alla storia passata come ID, 
				selezionando la transizione iniziale per il player. La transizione
				viene selezionata casualmente partendo dal numero delle
				transizioni presenti nella storia */
				let storyFile, startTransition;
				try {
					storyFile = await fileOperations.read(`story_${uuidParam}.json`, path.join(app.get('stories'), user));
					startTransition = Math.floor(Math.random() * Object.keys(storyFile.transitions).length);
				} catch (e) {
					next(e);
				}

				/* Lo stato iniziale del player sarà strutturato come un 
				oggetto in cui la prima chiave identifica lo stato
				dell'attività corrente, la seconda le informazioni relative
				alla storia, come la transizione selezionata e la data di inizio */
				const date = new Date();
				const playerStatus = {
					status: {
						activity: 'start',
						dateActivity: date
					},
					info: {
						transition: startTransition,
						dateStart: date
					},
					name: 'player'
				};

				/* Generato ID del player che verrà inserito all'interno
				del file contenente tutti i player e le storie di cui fanno parte */
				const playerID = uuidv4();

				res.locals.playerID = playerID;
				req.body = playerStatus;
				res.locals.response = { player: playerStatus, story: storyFile };

				res.cookie('playerID', playerID, { httpOnly: true }, { maxAge: '3h' });

				next();
			} else {
				next(new Error('story not valid'));
			}
		} else {
			next(new Error('uuid not valid'));
		}
	},
	updateStatusPlayer
);

/* Richieste per aggiornare lo stato del player */
let statusPending = {};

router.get('/status', (req, res, next) => {
	res.send(statusPending);
	statusPending = {};
});

router.put(
	'/:id/players/status',
	(req, res, next) => {
		res.locals.playerID = req.cookies.playerID;
		statusPending[req.cookies.playerID] = { story: req.params.id, ...req.body };
		next();
	},
	updateStatusPlayer
);

let answersPending = {};

router.get('/answers', (req, res) => {
	res.send(answersPending);
	answersPending = {};
});

router.put(
	'/:id/players/answer',
	(req, res, next) => {
		res.locals.playerID = req.cookies.playerID;
		answersPending[req.cookies.playerID] = { story: req.params.id, answer: req.body.answer };
		next();
	},
	updateStatusPlayer
);

let questionsPending = {};

router.get('/:id/players/question', (req, res) => {
	res.send(questionsPending[req.cookies.playerID] || {});
	delete questionsPending[req.cookies.playerID];
});

router.put(
	'/:id/players/:name/question',
	(req, res, next) => {
		res.locals.playerID = req.params.name;
		questionsPending[req.params.name] = req.body.question;
		next();
	},
	updateStatusPlayer
);

/* Richiesta per modificare il nome */
router.put(
	'/:id/players/:name/name',
	(req, res, next) => {
		res.locals.playerID = req.params.name;
		next();
	},
	updateStatusPlayer
);

/*
router.put(
	'/:id/answer',
	(req, res, next) => {
		res.locals.playerID = req.cookies.playerId;
		res.locals.emitName = 'answer';
		next();
	},
	updateStatusPlayer
);

router.put(
	'/:id/message/:name',
	(req, res, next) => {
		console.log(req.body);
		res.locals.playerID = req.params.name;
		res.locals.emitName = 'chat';
		next();
	},
	updateStatusPlayer
);

router.put(
	'/:id/message',
	(req, res, next) => {
		console.log(req.body);
		res.locals.playerID = req.cookies.playerId;
		res.locals.emitName = 'chat';
		next();
	},
	updateStatusPlayer
); */

module.exports = router;
