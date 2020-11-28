import React, { useState, useEffect } from 'react';

import { Button, Col, InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function FormAnswerPlayer({ answer }) {
	return <Form.Control as='textarea' cols={8} rows={2} placeholder={answer} style={{ resize: 'none' }} readOnly />;
}

function OpenQuestion(props) {
	return (
		<>
			<p>{props.question.value}</p>

			<Form
				onSubmit={e =>
					props.fetchAnswerCorrection(e, props.player.story, props.player.id, true, props.inputs.score.value)
				}>
				<h5>In caso di risposta corretta: </h5>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label>
							Assegna un valore da {props.question.minScore} a {props.question.maxScore}
						</Form.Label>
					</InputGroup.Prepend>
					<Form.Control
						type='number'
						name='score'
						value={props.inputs.score ? props.inputs.score.value : props.question.minScore}
						min={props.question.minScore}
						max={props.question.maxScore}
						onChange={e =>
							props.setInputs({ ...props.inputs, [e.target.name]: { value: e.target.value, error: false } })
						}
					/>
					<InputGroup.Append>
						<Button type='submit'>Invia</Button>
					</InputGroup.Append>
				</InputGroup>
			</Form>

			<Form
				onSubmit={e =>
					props.fetchAnswerCorrection(e, props.player.story, props.player.id, false, props.inputs.tipAnswer.value)
				}>
				<h5>In caso di risposta non corretta: </h5>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label>Inserisci messaggio per il player</Form.Label>
					</InputGroup.Prepend>
					<Form.Control
						name='tipAnswer'
						value={props.inputs.tipAnswer ? props.inputs.tipAnswer.value : ''}
						onChange={e =>
							props.setInputs({ ...props.inputs, [e.target.name]: { value: e.target.value, error: false } })
						}
					/>
					<InputGroup.Append>
						<Button type='submit'>Invia</Button>
					</InputGroup.Append>
				</InputGroup>
			</Form>
		</>
	);
}

function FormAnswerCorrect(props) {
	const activity = props.player.informations.status.activity;
	
	let question = props.story.activities[activity].questions;
	if (question.length) {
		question = question[0];
	}

	return question.type === 'open' ? <OpenQuestion {...props} question={question} /> : null;
}

function PlayerAnswer(props) {
	return (
		<Card>
			<Card.Header>Risposta del Giocatore</Card.Header>
			<Card.Body>
				{props.player.informations.answer ? (
					<>
						<FormAnswerPlayer answer={props.player.informations.answer.value} />
						<FormAnswerCorrect {...props} />
					</>
				) : (
					'Nessuna risposta data'
				)}
			</Card.Body>
		</Card>
	);
}
export default PlayerAnswer;
