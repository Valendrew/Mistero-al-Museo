import React from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

function SelectAnswer(props) {
	return (
		<Form className="m-4" onSubmit={(e) => props.handleAddActivity(props.componentName, e)}>
			<h6>
				Risposta: {props.answer.value}
				{props.answer ? (props.answer.correct ? " | Corretta" : " | Sbagliata") : null}
			</h6>
			<Form.Control as="select" name={props.componentName} value={props.inputs[props.componentName] || ""} onChange={(e) => props.handleSelect(e)}>
				{props.activities.map((value, key) => {
					return (
						<option key={`attività_${key}`} value={value}>
							Attività {value}
						</option>
					);
				})}
				<option value="new_mission">Nuova missione</option>
			</Form.Control>
			<Button variant="outline-secondary" type="submit" value="submit">
				Procedi
			</Button>
		</Form>
	);
}

function ViewAnswer(props) {
	return (
		<ListGroup>
			<ListGroup.Item>
				Risposta: {props.answer.value} {props.answer ? (props.answer.correct ? " | Corretta" : " | Sbagliata") : null}
			</ListGroup.Item>
			<ListGroup.Item>{props.answerActivity}</ListGroup.Item>
		</ListGroup>
	);
}

function AnswerOverview(props) {
	return props.answerActivity === "" ? (
		<SelectAnswer {...props} componentName={`${props.selPrefix}_ans${props.answerNmb}`} />
	) : (
		<ViewAnswer {...props} />
	);
}

function Answers(props) {
	let answers;
	const questions = props.infoActivities[props.activityNmb].questions;
	if (questions.length)
		if (questions[0].answers) answers = questions[0].answers;
		else answers = [{ value: `${questions[0].value} (${questions[0].type} question)` }];
	else answers = [{ value: "Attività narrazione" }];
	return (
		<Row>
			{answers.map((value, key) => {
				return (
					<AnswerOverview
						{...props}
						key={`${props.selPrefix}_ans${key}`}
						answer={value}
						answerNmb={key}
						answerActivity={props.missions[props.activityNmb][key]}
					/>
				);
			})}
		</Row>
	);
}

export default Answers;
