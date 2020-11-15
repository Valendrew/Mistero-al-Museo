import React from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

function OpenQuestion() {
	return null;
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
				return val.type === "checkbox" || val.type === "radio"? <MultipleQuestion {...props} key={key} index={key} answer={val} /> : null;
			})}
		</Container>
	);
}

export default Questions;
