import React from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

function OpenQuestion(props) {
	return (
		<>
			<p>{props.answer.value}</p>
			<Form.Control value={props.answersSelected.value} onChange={(e) => props.onChangeAnswer(0, e.target.value)} />
		</>
	);
}

function MultipleQuestion(props) {
	return (
		<>
			<p>{props.answer.value}</p>
			<Form>
				{props.answer.answers.map((val, key) => {
					return (
						<Form.Check
							key={key}
							defaultChecked={props.answersSelected[key].value}
							name={`${props.answer.type}_${props.index}`}
							onChange={(e) => props.onChangeAnswer(key, e.target.checked)}
							type={props.answer.type}
							label={val.value}
						/>
					);
				})}
			</Form>
		</>
	);
}
function Questions(props) {
	return (
		<Container>
			{props.questions.map((val, key) => {
				return val.type === "open" ? (
					<OpenQuestion {...props} key={key} index={key} answer={val} />
				) : val.type === "widget" ? null : (
					<MultipleQuestion {...props} key={key} index={key} answer={val} />
				);
			})}
		</Container>
	);
}

export default Questions;
