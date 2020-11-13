import React, { useState } from "react";
import { nanoid } from "nanoid";

import Narrazione from "./Narrazione";
import Risposta from "./Risposta";

import { Form, Container, Row, Button, ButtonGroup } from "react-bootstrap";

const storylineInputs = [
	{ id: "text", value: "Inserisci un testo" },
	{ id: "img", value: "Inserisci un'immagine" },
	{ id: "video", value: "Inserisci un video" },
];
const questionsInputs = [
	{ id: "open", value: "Risposta aperta" },
	{ id: "checkbox", value: "Risposta con checkbox" },
	{ id: "radio", value: "Risposta con radio" },
	{ id: "widget", value: "Risposta con widget" },
];

function processStoryline(storyline, inputs) {
	var formData = new FormData();
	let storylineArray = Object.entries(storyline);
	storylineArray.sort((a, b) => a.order - b.order);
	let returnObj = [];
	returnObj = storylineArray.map(([key, val]) => {
		if (inputs[key].type === "img") {
			
			formData.append(key, inputs[key].value);
			return [inputs[key].type, "", inputs[val.alt].value];
		} else if (inputs[key].type === "text" || inputs[key].type === "video") {
			return [inputs[key].type, inputs[key].value];
		}
	});
	
		fetch(`/story/file/`, {
			method: "POST",
			body: formData,
		}).then((filesId) => {
			alert(filesId);
			let i = 0;
			returnObj.map((input) => {
				if (input[0] === "img" || input[0] === "video") {
					input[1] = filesId[++i];
				}
			});
		});

	return returnObj;
}

function processQuestions(questions, inputs) {
	let QuestionsArray = Object.entries(questions);
	QuestionsArray.sort((a, b) => a.order - b.order);
	let returnObj = [];

	returnObj = QuestionsArray.map(([key, val]) => {
		if (inputs[key].type === "open") {
			return {
				type: inputs[key].type,
				value: inputs[key].value,
				minScore: inputs[val.minScore].value,
				maxScore: inputs[val.maxScore].value,

				tips: Object.entries(val.tips).map(
					([tipNum, tipKey]) => inputs[tipKey].value
				),
			};
		} else if (inputs[key].type === "widget") {
		} else if (
			inputs[key].type === "checkbox" ||
			inputs[key].type === "radio"
		) {
			return {
				type: inputs[key].type,
				value: inputs[key].value,

				answers: Object.entries(val.answers).map(([answerNum, answerKeys]) =>
					answerKeys.map((answerKey) => inputs[answerKey].value)
				),

				tips: Object.entries(val.tips).map(
					([tipNum, tipKey]) => inputs[tipKey].value
				),
			};
		}
	});

	return returnObj;
}

export default function CreateActivity(props) {
	//const idStory = 1;
	const [inputs, setInputs] = useState({});
	const [activity, setActivity] = useState({ storyline: {}, questions: {} });

	function handleInput(value, id, questionId = null, type = null) {
		const valuePred = inputs[id].value;
		let newInputs = { [id]: { ...inputs[id], value: value } };

		if (questionId) {
			if (value === "") {
				value = 0;
				newInputs = { [id]: { ...inputs[id], value: value } };
			}

			const numberAnswers = value - valuePred;
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

	//Callback props
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

	const gestisciDati = (e) => {
		e.preventDefault();
		let toSend = {
			storyline: processStoryline(activity["storyline"], inputs),
			questions: processQuestions(activity["questions"], inputs),
		};
		console.log(toSend);
		fetch(`/story/activity/3/0`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(toSend),
		});
	};

	return (
		<Container>
			<Form onSubmit={gestisciDati}>
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

				<Row className="my-4">
					<ButtonGroup>
						<Button type="submit" variant="success">
							Prossima attività
						</Button>
						<Button type="button" variant="success">
							Concludi Storia
						</Button>
					</ButtonGroup>
				</Row>
			</Form>
		</Container>
	);
}
