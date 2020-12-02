import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { nanoid } from 'nanoid';

import Narrazione from './Narrazione';
import Risposta from './Risposta';

import { Form, Button, ButtonGroup, Card, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';

const storylineInputs = [
	{ id: 'text', value: 'Inserisci un testo' },
	{ id: 'img', value: "Inserisci un'immagine" },
	{ id: 'video', value: 'Inserisci un video' }
];
const questionsInputs = [
	{ id: 'open', value: 'Risposta aperta' },
	{ id: 'radio', value: 'Risposta multipla' },
	{ id: 'widget', value: 'Risposta con widget' }
];

async function processStoryline(storyline, inputs) {
	let formData = new FormData();
	const storylineSorted = Object.entries(storyline).sort((a, b) => a.index - b.index);
	let returnObj = [];

	returnObj = storylineSorted.map(([key, val]) => {
		let input = [inputs[key].type, inputs[key].value];
		if (inputs[key].type === 'img' || inputs[key].type === 'video') {
			if (typeof inputs[key].value === 'string') {
				const [id, ext] = input[1].split('.');
				input[1] = id;
				input[2] = ext;
			} else {
				formData.append(key, inputs[key].value);
				input[2] = input[1].type.split('/')[1];
			}
		}
		if (inputs[key].type === 'img') input[3] = inputs[val.alt].value;
		return [key, input];
	});

	if (formData.keys().next().value) {
		let result;
		try {
			result = await fetch(`/files`, {
				method: 'POST',
				body: formData
			});
		} catch (e) {
			result = {};
		}
		const data = await result.json();
		return returnObj.map(([key, value]) => {
			if (typeof value[1] !== 'string' && (value[0] === 'img' || value[0] === 'video')) {
				value[1] = data[key];
			}
			return value;
		});
	} else {
		const last = returnObj.map(([key, value]) => value);
		return last;
	}
}

function processQuestions(questions, inputs) {
	const questionSorted = Object.entries(questions).sort((a, b) => a.index - b.index);

	return questionSorted.map(([key, val]) => {
		let question = {
			type: inputs[key].type,
			value: inputs[key].value,
			tips: Object.entries(val.tips).map(([key, val]) => inputs[val].value)
		};
		if (inputs[key].type === 'open') {
			question = { ...question, minScore: inputs[val.minScore].value, maxScore: inputs[val.maxScore].value };
		} else if (inputs[key].type === 'widget') {
			return null;
		} else {
			question = {
				...question,
				dinamicRating: inputs[val.dinamicRating].value,
				answers: Object.entries(val.answers).map(([key, val]) => {
					return {
						value: inputs[val[0]].value,
						correct: inputs[val[1]].value,
						transition: inputs[val[2]].value,
						score: inputs[val[3]].value
					};
				})
			};
		}
		return question;
	});
}

function fetchValidInputs(inputs, activity) {
	if (
		!inputs.activityName.value.trim() ||
		(!Object.keys(activity.storyline).length && !Object.keys(activity.questions).length)
	) {
		return false;
	}
	for (let [key, val] of Object.entries(activity.storyline)) {
		if (inputs[key].type === 'img') {
			if (!inputs[val.alt].value.trim()) {
				return false;
			}
		}
		if (typeof inputs[key].value == 'string' && !inputs[key].value.trim()) {
			return false;
		}
	}

	for (let [key, val] of Object.entries(activity.questions)) {
		if (inputs[key].type === 'radio') {
			if (Object.values(val.answers).filter(value => !inputs[value[0]].value.trim()).length) {
				return false;
			}
		}
		if (!inputs[key].value.trim() || Object.values(val.tips).filter(value => !inputs[value].value.trim()).length) {
			return false;
		}
	}
	return true;
}

function addInputsToActivity(type, category, categoryLength) {
	const indexNewInput = categoryLength;
	let newInputs = {};
	let child = {};

	// Aggiunta nuovo input del tipo specificato
	const elementID = nanoid();

	/* Se l'input appartiene a storyline (narrazione), allora
	potrà essere aggiunto un input per le immagini (con campo 
	testo per la descrizione), per i video (con file per sottotitoli)
	oppure per il testo */
	if (category === 'storyline') {
		/* Nel caso l'input sia un'immagine viene aggiunta come 
		chiave dell'oggetto il suo ID (elementID), in più viene
		creato un input di tipo testo per la sua descrizione (alt) */
		if (type === 'img') {
			// ID dell'input della descrizione (ALT) dell'immagine
			const altID = nanoid();
			newInputs = { [altID]: { type: 'text', value: '' } };
			child = {
				[elementID]: {
					index: indexNewInput,
					alt: altID
				}
			};
		} else if (type === 'video') {
			/* Nel caso l'input sia un video viene aggiunta come chiave 
		dell'oggetto il suo ID, in più viene creato un nuovo input di tipo file
		per aggiungere il sottotitolo al video */
			const subID = nanoid();
			newInputs = { [subID]: { type: 'file', value: '' } };
			child = {
				[elementID]: { index: indexNewInput, sub: subID }
			};
		} else if (type === 'text') {
			/* Nel caso l'input sia un testo verrà aggiunto senza nessun campo aggiuntivo */
			child = {
				[elementID]: { index: indexNewInput }
			};
		}
	} else if (category === 'questions') {
		/* Nel caso in cui l'input appartenga a questions (domande), potranno
	esserci domande aperte, domande con radio oppure widget */

		/* Aggiunto l'input per poter aumentare o diminuire il numero di suggerimenti */
		const tipsRangeID = nanoid();
		
		newInputs = {
			[tipsRangeID]: { type: 'number', value: '0' },
			
		};
		/* Nel caso in cui l'input sia una domanda aperta verranno aggiunti 
		due campi per indicare il punteggio minimo e massimo assegnabili, mentre
		il campo relativo alla domanda sarà identificato da elementID */
		if (type === 'open') {
			/* Input relativi al punteggio minimo e massimo */
			const minID = nanoid();
			const maxID = nanoid();
			newInputs = {
				...newInputs,
				[minID]: { type: 'number', value: '-50' },
				[maxID]: { type: 'number', value: '50' }
			};
			child = {
				[elementID]: {
					index: indexNewInput,
					minScore: minID,
					maxScore: maxID,
					tipsRange: tipsRangeID,
					tips: {}
				}
			};
		} else if (type === 'widget') {
			//
		} else if (type === 'radio') {
			/* Se l'input è un radio verrà creato un input aggiuntivo
			per poter aumentare o diminuire il numero di risposte da associare
			alla domanda */
			const answersRangeID = nanoid();
			const dinamicRatingID = nanoid();
			newInputs = {
				...newInputs,
				[answersRangeID]: { type: 'number', value: '0' },
				[dinamicRatingID]: { value: false }
			};
			child = {
				[elementID]: {
					index: indexNewInput,
					answersRange: answersRangeID,
					answers: {},
					tipsRange: tipsRangeID,
					tips: {},
					dinamicRating: dinamicRatingID
				}
			};
		}
	}
	newInputs = { ...newInputs, [elementID]: { type: type, value: '' } };
	return { inputs: newInputs, activity: child };
}

function editInput(inputToEdit, inputID, newValue, child = null, questionID = null, type = null) {
	/* Viene salvato il valore attuale dell'input (prima della modifica) */
	let valuePred = inputToEdit.value;

	/* Oggetto newInputs per aggiornare il velore di inputID e nel caso questionID
	fosse valido aggiungere nuovi input  */
	let newInputs = {};

	/* Se viene indicato questionID vuol dire che è stata apportata 
		una modifica all'input number per aumentare o decrementare
		i suggerimenti (tips) oppure le risposte (answers) */
	if (questionID) {
		/* Se il value è stato modificato non usando i bottoni previsti
		dall'input number, allora viene reimpostato a 0 */
		if (typeof newValue === 'string' && !newValue.trim()) {
			newValue = '0';
		}

		//let { [type]: child, ...other } = activity.questions[questionId];

		/* Numero di input da aggiungere/rimuovere calcolato come differenza
		tra il valore da modificare e il valore attuale */
		const deltaInputsToAdd = parseInt(newValue) - parseInt(valuePred);

		/* Se delta > 0 vuol dire che saranno aggiunti delta input nuovi */
		if (deltaInputsToAdd > 0) {
			for (let i = valuePred; i < newValue; i++) {
				/* Se il tipo è answers, verranno creati 4 nuovi input per ogni
				risposta, ad identificare rispettivamente il testo della risposta,
				la checkbox se è corretta, la checkbox se richiede una transizione
				e un number per il punteggio */
				if (type === 'answers') {
					const answerID = nanoid();
					const correctnessID = nanoid();
					const transitionID = nanoid();
					const scoreID = nanoid();

					newInputs = {
						...newInputs,
						[answerID]: { type: 'text', value: '' },
						[correctnessID]: { type: 'checkbox', value: false },
						[transitionID]: { type: 'checkbox', value: false },
						[scoreID]: { type: 'number', value: '0' }
					};
					child = {
						...child,
						[i]: [answerID, correctnessID, transitionID, scoreID]
					};
				} else if (type === 'tips') {
					const tipID = nanoid();
					newInputs = { ...newInputs, [tipID]: { type: 'text', value: '' } };
					child = { ...child, [i]: tipID };
				}
			}
		} else if (deltaInputsToAdd < 0) {
			/* Se delta < 0 allora verrano rimossi delta input  */
			for (let i = newValue; i <= valuePred; i++) {
				const { [i]: childValue, ...otherElements } = child;
				child = { ...otherElements };
			}
		}
	}
	newInputs = { ...newInputs, [inputID]: { ...inputToEdit, value: newValue } };
	return child ? { inputs: newInputs, activity: child } : { inputs: newInputs };
}

function Activity() {
	const history = useHistory();
	const [historyState, setHistoryState] = useState(history.location.state);
	const [invalidInputs, setInvalidInputs] = useState(null);
	const [inputs, setInputs] = useState({ activityName: { type: 'text', value: '' } });
	const [activity, setActivity] = useState({ questions: {}, storyline: {} });
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	const handleInput = (value, id, questionID = null, type = null) => {
		let inputEdited;
		if (questionID) {
			let { [type]: child, ...other } = activity.questions[questionID];
			inputEdited = editInput(inputs[id], id, value, child, questionID, type);
			setActivity({
				...activity,
				questions: {
					...activity.questions,
					[questionID]: { ...other, [type]: inputEdited.activity }
				}
			});
		} else {
			inputEdited = editInput(inputs[id], id, value);
		}
		setInputs({ ...inputs, ...inputEdited.inputs });
	};

	const handleAddInput = (type, category) => {
		const inputsAdded = addInputsToActivity(type, category, Object.keys(activity[category]).length);
		// Aggiunta nuovo input del tipo specificato
		setInputs({ ...inputs, ...inputsAdded.inputs });
		setActivity({ ...activity, [category]: { ...activity[category], ...inputsAdded.activity } });
	};

	const handleRemoveInput = (id, category) => {
		const { [id]: child, ...other } = activity[category];
		setActivity({ ...activity, [category]: other });
	};

	const gestisciDati = async (e, buttonPressed) => {
		e.preventDefault();

		if (fetchValidInputs(inputs, activity)) {
			const storyline = await processStoryline(activity.storyline, inputs);
			const questions = processQuestions(activity.questions, inputs);

			const data = {
				name: inputs.activityName.value,
				storyline: storyline,
				questions: questions
			};

			await fetch(`/stories/${historyState.idStory}/activities/${historyState.idActivity}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (buttonPressed === 'nextActivity') {
				const nextActivity = parseInt(historyState.idActivity) + 1;
				history.push('activity', {
					idStory: historyState.idStory,
					idActivity: nextActivity
				});
			} else {
				await fetch(`/stories/${historyState.idStory}/missions`, { method: 'DELETE' });

				await fetch(`/stories/${historyState.idStory}/transitions`, { method: 'DELETE' });

				if (buttonPressed === 'newMissions') {
					history.replace('missions', { idStory: historyState.idStory });
				} else if (buttonPressed === 'saveTemp') {
					/* Se salvataggio temporaneo, allora viene reinderizzato a home */
					history.replace('/autore');
				}
			}

			setIsLoaded({ loaded: false, error: null });
		} else {
			setInvalidInputs(<p className='text-danger'>I campi non sono stati completati, ricontrolla!</p>);
		}
	};

	const fetchActivityToEdit = data => {
		let newInputs = { activityName: { type: 'text', value: data.name } };
		let newActivity = { questions: {}, storyline: {} };

		for (let val of data.storyline) {
			let { inputs, activity } = addInputsToActivity(val[0], 'storyline', Object.keys(newActivity.storyline).length);
			const mainElementID = Object.keys(activity)[0];

			if (val[0] === 'img') {
				const altID = activity[mainElementID].alt;
				inputs = { ...inputs, [altID]: { ...inputs[altID], value: val[3] } };
			}
			if (val[0] === 'img' || val[0] === 'video') {
				inputs = { ...inputs, [mainElementID]: { ...inputs[mainElementID], value: `${val[1]}.${val[2]}` } };
			} else if (val[0] === 'text') {
				inputs = { ...inputs, [mainElementID]: { ...inputs[mainElementID], value: val[1] } };
			}

			newInputs = { ...newInputs, ...inputs };
			newActivity.storyline = { ...newActivity.storyline, ...activity };
		}

		for (let val of data.questions) {
			let { inputs, activity } = addInputsToActivity(val.type, 'questions', Object.keys(newActivity.questions).length);
			const mainElementID = Object.keys(activity)[0];
			let question = activity[mainElementID];

			if (val.type === 'open') {
				/* Se la domanda è aperta (open) allora modifico solo i valori
				degli input relativi al punteggio minimo e massimo */
				inputs = {
					...inputs,
					[question.minScore]: { ...inputs[question.minScore], value: val.minScore },
					[question.maxScore]: { ...inputs[question.maxScore], value: val.maxScore }
				};
			} else if (val.type === 'radio') {
				//debugger;
				/* Se la domanda è a risposta multipla (radio), allora devo creare i nuovi
				input per ogni risposta possibile */

				/* inputsEdited.inputs = i nuovi input che sono stati aggiunti
				inputsEdited.activity = l'oggetto answers contenente le risposte */
				let inputsEdited = editInput(
					inputs[question.answersRange],
					question.answersRange,
					val.answers.length,
					{},
					mainElementID,
					'answers'
				);
				question.answers = inputsEdited.activity;
				for (let [key, value] of Object.entries(inputsEdited.activity)) {
					inputsEdited.inputs[value[0]].value = val.answers[key].value;
					inputsEdited.inputs[value[1]].value = val.answers[key].correct;
					inputsEdited.inputs[value[2]].value = val.answers[key].transition;
					inputsEdited.inputs[value[3]].value = val.answers[key].score;
				}
				inputs = { ...inputs, ...inputsEdited.inputs };
			}
			/* Vengono aggiunti i suggerimenti */
			let inputsEdited = editInput(
				inputs[question.tipsRange],
				question.tipsRange,
				val.tips.length,
				{},
				mainElementID,
				'tips'
			);
			question.tips = inputsEdited.activity;
			for (let [key, value] of Object.entries(inputsEdited.activity)) {
				inputsEdited.inputs[value].value = val.tips[key];
			}
			inputs = { ...inputs, ...inputsEdited.inputs };
			
			/* Aggiungo la modalità di valutazione */

			inputs = {
				...inputs,
				[question.dinamicRating]: { ...inputs[question.dinamicRating], value: val.dinamicRating }
			};

			inputs = { ...inputs, [mainElementID]: { ...inputs[mainElementID], value: val.value } };
			newInputs = { ...newInputs, ...inputs };
			newActivity.questions = { ...newActivity.questions, [mainElementID]: question };
		}
		setInputs(newInputs);
		setActivity(newActivity);
	};

	useEffect(() => {
		const fetchData = async () => {
			const { idStory, idActivity, action } = history.location.state;
			if (action) {
				const result = await fetch(`/stories/${idStory}/activities/${idActivity}`);
				if (!result.ok) {
					setIsLoaded({ loaded: true, error: result.statusText });
				} else {
					const data = await result.json();
					fetchActivityToEdit(data);
					setIsLoaded({ loaded: true });
				}
			} else {
				setInputs({ activityName: { type: 'text', value: '' } });
				setActivity({ questions: {}, storyline: {} });
				setIsLoaded({ loaded: true });
			}
			setHistoryState(history.location.state);
			setInvalidInputs(null);
		};
		if (!isLoaded.loaded) fetchData();
	}, [isLoaded, history]);

	return (
		<Card border={'light'}>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h5>Errore {isLoaded.error}</h5>
				) : (
					<>
						<Card.Header>Stai creando l'attività {historyState.idActivity}</Card.Header>
						<Form>
							<Card.Body>
								<Row className='mb-4'>
									<Col sm={12}>
										<Form.Label>Aggiungi nome attività</Form.Label>
										<Form.Control
											type='text'
											name='activityName'
											value={inputs.activityName.value}
											onChange={e => handleInput(e.target.value, 'activityName')}
										/>
									</Col>
								</Row>

								<Row className='mb-4'>
									<Col sm={12}>
										<Narrazione
											storyline={activity.storyline}
											inputs={inputs}
											storylineInputs={storylineInputs}
											handleInput={handleInput}
											handleAddInput={handleAddInput}
											handleRemoveInput={handleRemoveInput}
										/>
									</Col>
								</Row>
								<Row className='mb-4'>
									<Col sm={12}>
										<Risposta
											questions={activity.questions}
											inputs={inputs}
											questionsInputs={questionsInputs}
											handleInput={handleInput}
											handleAddInput={handleAddInput}
											handleRemoveInput={handleRemoveInput}
										/>
									</Col>
								</Row>
							</Card.Body>
							<Card.Footer>
								<Row>
									<ButtonGroup>
										{historyState.action ? null : (
											<>
												<Button
													className='mt-2 mr-2'
													type='submit'
													name='nextActivity'
													variant='success'
													onClick={e => gestisciDati(e, e.target.name)}>
													Prossima attività
												</Button>
												<Button
													className='mt-2 mr-2'
													type='submit'
													name='saveTemp'
													variant='success'
													onClick={e => gestisciDati(e, e.target.name)}>
													Salva temporaneamente la missione
												</Button>
											</>
										)}
										{historyState.idActivity >= 9 || historyState.action ? (
											<Button
												className='mt-2 mr-2'
												type='submit'
												name='newMissions'
												variant='success'
												onClick={e => gestisciDati(e, e.target.name)}>
												Procedi a creare le missione
											</Button>
										) : null}
									</ButtonGroup>
								</Row>
								<Row>
									<Col>{invalidInputs}</Col>
								</Row>
							</Card.Footer>
						</Form>
					</>
				)
			) : (
				<h6>Loading</h6>
			)}
		</Card>
	);
}

export default Activity;
