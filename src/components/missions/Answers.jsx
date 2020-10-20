import React from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

function SelectAnswer(props) {
	return (
		<Form onSubmit={(e) => props.handleAddActivity(props.componentName, e)}>
			<h6>Risposta {props.answerValue}</h6>
			<Form.Control
				as="select"
				name={props.componentName}
				value={props.inputs[props.componentName] || ""}
				onChange={(e) => props.handleSelect(e)}
			>
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
			<ListGroup.Item>Risposta {props.answerValue}</ListGroup.Item>
			<ListGroup.Item>{props.answer}</ListGroup.Item>
		</ListGroup>
	);
}

function AnswerOverview(props) {
	return props.answer === "" ? (
		<SelectAnswer {...props} componentName={`${props.selPrefix}_ans${props.answerNmb}`} />
	) : (
		<ViewAnswer {...props} />
	);
}

function Answers(props) {
	const answers = props.infoActivities[props.activityNmb]["questions"][0]["answers"];
	return (
		<Row>
			{answers.map((value, key) => {
				return (
					<AnswerOverview
						{...props}
						key={`${props.selPrefix}_ans${key}`}
						answerValue={value["value"]}
						answerNmb={key}
						answer={props.missions[props.activityNmb][key]}
					/>
				);
			})}
		</Row>
	);
}

export default Answers;
