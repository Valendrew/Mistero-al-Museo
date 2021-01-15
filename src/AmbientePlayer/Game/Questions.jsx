import React from 'react';

import { Col, Row, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
/* import WidgetNumerico from '../../AmbienteAutore/activities/Widgets/WidgetNumerico';
import WidgetPapiro from '../../AmbienteAutore/activities/Widgets/WidgetPapiro'; */

function OpenQuestion(props) {
	return (
		<Form.Group>
			<Form.Label id='answer_value' className={props.style.container}>
				<span className={props.style.paragrafo}>Risposta alla domanda</span>
			</Form.Label>
			<Form.Control
				name='open_question'
				as='textarea'
				rows={4}
				value={props.inputsQuestion[0].value}
				onChange={e => props.onChangeAnswer(0, e.target.value)}
				className={props.style.rispostaAperta}
				aria-labelledby='answer_value'
				required
				aria-required
			/>
		</Form.Group>
	);
}

function MultipleQuestion(props) {
	return (
		<Form.Group role='radiogroup' aria-label='Risposta alla domanda'>
			{props.question.answers.map((value, key) => (
				<Form.Check
					className={props.style.rispostaMultipla}
					key={key}
					id={`radio_${key}`}
					name='radio_question'
					type={props.question.type}
					label={value.value}
					onChange={e => props.onChangeAnswer(key, e.target.checked)}
					checked={props.inputsQuestion[key].value}
					required
					aria-checked={props.inputsQuestion[key].value}
					aria-required
				/>
			))}
		</Form.Group>
	);
}
function Questions(props) {
	return (
		<div role='group' aria-labelledby='legend_question'>
			<Form>
				<Form.Group as={Row}>
					<Form.Label id='legend_question' as='legend' className={props.style.container} column>
						<span className={props.style.paragrafo}>{props.question.value}</span>
						{props.errorAnswer}
					</Form.Label>
				</Form.Group>

				<Row>
					<Col>
						{props.question.type === 'open' ? (
							<OpenQuestion {...props} />
						) : props.question.type === 'widget' ? null : (
							<MultipleQuestion {...props} />
						)}
					</Col>
				</Row>

				{props.waitingOpen}
				<Button
					name='nextActivity'
					type='submit'
					variant='dark'
					onClick={e => props.fetchAnswers(e)}
					className={props.style.bottone}
					disabled={props.waitingOpen ? true : false}>
					Prosegui all'attività successiva
				</Button>
			</Form>
		</div>
	);
}

export default Questions;
