import React from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import WidgetNumerico from '../../AmbienteAutore/activities/Widgets/WidgetNumerico';
import WidgetPapiro from '../../AmbienteAutore/activities/Widgets/WidgetPapiro';

function OpenQuestion(props) {
	return props.question.widgetId === 'classico' ? (
		<Form.Control
			name='open_question'
			value={props.inputsQuestion[0].value}
			onChange={e => props.onChangeAnswer(0, e.target.value)}
			className={props.style.rispostaAperta}
		/>
	) : props.question.widgetId === 'papiro' ? (
		<WidgetPapiro {...props} />
	) : (
		<WidgetNumerico {...props} />
	);
}

function MultipleQuestion(props) {
	return (
		<div class='multipleQuestion'>
			<Form>
				{props.question.answers.map((value, key) => {
					return (
						<div className={props.style.rispostaMultipla}>
							<Form.Check
								key={key}
								defaultChecked={props.inputsQuestion[key].value}
								name='radio_question'
								onChange={e => props.onChangeAnswer(key, e.target.checked)}
								type={props.question.type}
								label={value.value}
							/>
						</div>
					);
				})}
			</Form>
		</div>
	);
}
function Questions(props) {
	return (
		<Container fluid>
			<p className={props.style.paragrafo}>{props.question.value}</p>

			{props.question.type === 'open' ? <OpenQuestion {...props} /> : <MultipleQuestion {...props} />}
		</Container>
	);
}

export default Questions;
