import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { nanoid } from "nanoid";

import Narrazione from "./Narrazione";
import Risposta from "./Risposta";

import { Form, Container, Button, ButtonGroup } from "react-bootstrap";
import { useEffect } from "react";

const storylineInputs = [
	{ id: "text", value: "Inserisci un testo" },
	{ id: "img", value: "Inserisci un'immagine" },
	{ id: "video", value: "Inserisci un video" },
];
/* const questionsInputs = [
	{ id: "open", value: "Risposta aperta" },
	{ id: "checkbox", value: "Risposta con checkbox" },
	{ id: "radio", value: "Risposta con radio" },
	{ id: "widget", value: "Risposta con widget" },
];
 */
const questionsInputs = [
	{ id: "open", value: "Risposta aperta" },
	{ id: "radio", value: "Risposta con radio" },
	{ id: "widget", value: "Risposta con widget" },
];

async function processStoryline(storyline, inputs, idStory) {
	let formData = new FormData();
	const storylineSorted = Object.entries(storyline).sort((a, b) => a.order - b.order);
	let returnObj = [];

	returnObj = storylineSorted.map(([key, val]) => {
		let input = [inputs[key].type, inputs[key].value];
		if (inputs[key].type === "img" || inputs[key].type === "video") {
			formData.append(key, inputs[key].value);
			input[2] = input[1].type.split("/")[1];
		}
		if (inputs[key].type === "img") input[3] = inputs[val.alt].value;
		return [key, input];
	});

	if (formData.keys().next().value) {
		let result;
		try {
			result = await fetch(`/files/${idStory}`, {
				method: "POST",
				body: formData,
			});
		} catch (e) {
			result = {};
		}
		const data = await result.json();
		return returnObj.map(([key, value]) => {
			if (value[0] === "img" || value[0] === "video") {
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
	const questionSorted = Object.entries(questions).sort((a, b) => a.order - b.order);

	return questionSorted.map(([key, val]) => {
		let question = {
			type: inputs[key].type,
			value: inputs[key].value,
			tips: Object.entries(val.tips).map(([key, val]) => inputs[val].value),
		};
		if (inputs[key].type === "open") {
			question = { ...question, minScore: inputs[val.minScore].value, maxScore: inputs[val.maxScore].value };
		} else if (inputs[key].type === "widget") {
			return null;
		} else {
			question = {
				...question,
				answers: Object.entries(val.answers).map(([key, val]) => {
					return {
						value: inputs[val[0]].value,
						correct: inputs[val[1]].value,
						transition: inputs[val[2]].value,
						score: inputs[val[3]].value,
					};
				}),
			};
		}
		return question;
	});
}

export default function CreateActivity(props) {
	const history = useHistory();
	const { id, number } = history.location.state;

	const [invalidInputs, setInvalidInputs] = useState();
	const [inputs, setInputs] = useState();
	const [activity, setActivity] = useState();
	const [isLoaded, setIsLoaded] = useState(false);

	function handleInput(value, id, questionId = null, type = null) {
		const valuePred = inputs[id].value; // valore precedente dell'input
		let newInputs = { [id]: { ...inputs[id], value: value } }; // aggiornato inputs con nuovo valore

		/* Se viene selezionato questionId vuol dire che è stata apportata 
		una modifica all'input number di tips oppure answers */
		if (questionId) {
			// Nel caso il value sia stato lasciato vuoto (ossia non un numero)
			if (value === "") {
				value = 0;
				newInputs = { [id]: { ...inputs[id], value: value } };
			}
			// Numero di risposte da aggiungere/rimuovere
			const numberAnswers = parseInt(value) - parseInt(valuePred);
			// Ottengo il value della key di valore type (tips/answers)
			let { [type]: child, ...other } = activity.questions[questionId];
			if (numberAnswers > 0) {
				for (let i = valuePred; i < value; i++) {
					if (type === "answers") {
						const idAnswer = nanoid();
						const idCorrect = nanoid();
						const idTransition = nanoid();
						const idScore = nanoid();

						newInputs = {
							...newInputs,
							[idAnswer]: { type: "text", value: "" },
							[idCorrect]: { type: "checkbox", value: false },
							[idTransition]: { type: "checkbox", value: false },
							[idScore]: { type: "number", value: "0" },
						};
						child = {
							...child,
							[i]: [idAnswer, idCorrect, idTransition, idScore],
						};
					} else {
						const idTip = nanoid();
						newInputs = { ...newInputs, [idTip]: { type: "text", value: "" } };
						child = { ...child, [i]: idTip };
					}
				}
			} else if (numberAnswers < 0) {
				for (let i = value; i <= valuePred; i++) {
					const { [i]: typeChild, ...otherElements } = child;
					child = { ...otherElements };
				}
			}
			setActivity({
				...activity,
				questions: {
					...activity.questions,
					[questionId]: { ...other, [type]: child },
				},
			});
		}
		setInputs({ ...inputs, ...newInputs });
	}

	function handleAddInput(type, category) {
		// Aggiunta nuovo input del tipo specificato
		const elementId = nanoid();
		let newInputs = { [elementId]: { type: type, value: "" } };
		let { [category]: child, ...other } = activity;
		if (category === "storyline") {
			// New inputs is image
			if (type === "img") {
				const childId = nanoid();
				newInputs = { ...newInputs, [childId]: { type: "text", value: "" } };
				child = {
					...child,
					[elementId]: {
						order: Object.keys(activity[category]).length,
						alt: childId,
					},
				};
			} else {
				child = {
					...child,
					[elementId]: { order: Object.keys(activity[category]).length },
				};
			}
		} else {
			const tipsRangeId = nanoid();
			newInputs = {
				...newInputs,
				[tipsRangeId]: { type: "number", value: "0" },
			};
			// Input is open question
			if (type === "open") {
				const maxId = nanoid();
				const minId = nanoid();
				newInputs = {
					...newInputs,
					[minId]: { type: "number", value: "-50" },
					[maxId]: { type: "number", value: "50" },
				};
				child = {
					...child,
					[elementId]: {
						type: type,
						order: Object.keys(activity[category]).length,
						minScore: minId,
						maxScore: maxId,
						tipsRange: tipsRangeId,
						tips: {},
					},
				};
			} else if (type === "widget") {
				//
			} else {
				// Input is a checkbox or radio
				const answersRangeId = nanoid();

				newInputs = {
					...newInputs,
					[answersRangeId]: { type: "number", value: "0" },
				};
				child = {
					...child,
					[elementId]: {
						type: type,
						order: Object.keys(activity[category]).length,
						answersRange: answersRangeId,
						answers: {},
						tipsRange: tipsRangeId,
						tips: {},
					},
				};
			}
		}
		setInputs({ ...inputs, ...newInputs });
		setActivity({ ...other, [category]: child });
	}

	function handleRemoveInput(id, category) {
		const { [id]: child, ...other } = activity[category];
		setActivity({ ...activity, [category]: other });
	}

	const gestisciDati = async (e, buttonPressed) => {
		e.preventDefault();
		if (Object.keys(activity.storyline).length) {
			const data = {
				name: inputs.activityName,
				storyline: await processStoryline(activity["storyline"], inputs, id),
				questions: processQuestions(activity["questions"], inputs),
			};
			fetch(`/stories/${id}/activities/${number}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}).then((res) => {
				setIsLoaded(false);
				if (buttonPressed === "nextActivity") history.push("activity", { id: id, number: number + 1 });
				else history.push("missions", { id: id });
			});
		} else {
			setInvalidInputs("Gli input non sono completati");
		}
	};

	useEffect(() => {
		if (!isLoaded) {
			setActivity({ storyline: {}, questions: {} });
			setInputs({ activityName: "" });
			setInvalidInputs(null);
			setIsLoaded(true);
		}
	}, [isLoaded]);

	return isLoaded ? (
		<Container>
			<h5>Stai creando l'attività {number + 1}</h5>
			{invalidInputs}
			<Form>
				<Form.Label>Aggiungi nome attività</Form.Label>
				<Form.Control
					type="text"
					name="activityName"
					value={inputs.activityName}
					onChange={(e) => setInputs({ ...inputs, activityName: e.target.value })}
				/>
				<Narrazione
					storyline={activity.storyline}
					inputs={inputs}
					storylineInputs={storylineInputs}
					handleInput={handleInput}
					handleAddInput={handleAddInput}
					handleRemoveInput={handleRemoveInput}
				/>
				<Risposta
					questions={activity.questions}
					inputs={inputs}
					questionsInputs={questionsInputs}
					handleInput={handleInput}
					handleAddInput={handleAddInput}
					handleRemoveInput={handleRemoveInput}
				/>

				<ButtonGroup>
					<Button type="submit" name="nextActivity" variant="success" onClick={(e) => gestisciDati(e, e.target.name)}>
						Prossima attività
					</Button>
					{number >= 9 ? (
						<Button type="submit" name="newMissions" variant="success" onClick={(e) => gestisciDati(e, e.target.name)}>
							Procedi a creare le missione
						</Button>
					) : null}
				</ButtonGroup>
			</Form>
		</Container>
	) : (
		<h6>Loading</h6>
	);
}
