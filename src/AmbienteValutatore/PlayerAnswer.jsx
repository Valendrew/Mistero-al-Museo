import React from 'react';

import { Button, InputGroup, ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function FormAnswerPlayer({ answer }) {
	return (
		<Form.Control
			as='textarea'
			cols={8}
			rows={2}
			placeholder={answer}
			style={{ resize: 'none' }}
			readOnly
		/>
	);
}

function OpenQuestion(props) {
	return (
		<>
			<p>{props.question.value}</p>
			<hr />
			<Form
				onSubmit={e => {
					e.preventDefault();
					props.fetchAnswerCorrection(
						props.player.story,
						props.player.id,
						true,
						props.inputs.score ? props.inputs.score.value : props.question.minScore,
						props.player.informations.answer.value
					);
				}}>
				<p style={{ fontSize: ' 1.5rem' }}>In caso di risposta corretta: </p>
				<InputGroup>
					<InputGroup.Prepend>
						<InputGroup.Text>
							Assegna un valore da {props.question.minScore} a {props.question.maxScore}
						</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control
						required
						type='number'
						name='score'
						value={props.inputs.score ? props.inputs.score.value : props.question.minScore}
						min={props.question.minScore}
						max={props.question.maxScore}
						onChange={e =>
							props.setInputs({
								...props.inputs,
								[e.target.name]: { value: e.target.value, error: false }
							})
						}
					/>
					<InputGroup.Append>
						<Button type='submit' variant='success'>
							Invia
						</Button>
					</InputGroup.Append>
				</InputGroup>
			</Form>
			<hr />
			<Form
				onSubmit={e => {
					e.preventDefault();
					props.fetchAnswerCorrection(
						props.player.story,
						props.player.id,
						false,
						props.inputs.tipAnswer ? props.inputs.tipAnswer.value : '',
						props.player.informations.answer.value
					);
				}}>
				<p style={{ fontSize: ' 1.5rem' }}>In caso di risposta non corretta: </p>
				<InputGroup className='mb-2'>
					<InputGroup.Prepend>
						<InputGroup.Text>Inserisci messaggio per il player</InputGroup.Text>
					</InputGroup.Prepend>
					<Form.Control
						name='tipAnswer'
						value={props.inputs.tipAnswer ? props.inputs.tipAnswer.value : ''}
						onChange={e =>
							props.setInputs({
								...props.inputs,
								[e.target.name]: { value: e.target.value, error: false }
							})
						}
					/>
					<InputGroup.Append>
						<Button type='submit' variant='danger'>
							Invia
						</Button>
					</InputGroup.Append>
				</InputGroup>
				{props.question.tips.length ? (
					<>
						Aiuti disponibili, clicca per selezionarli!{' '}
						<ListGroup variant='flush'>
							{props.question.tips.map((val, k) => (
								<ListGroup.Item key={k}>
									<Button
										variant='light'
										onClick={() =>
											props.setInputs({ ...props.inputs, tipAnswer: { value: val, error: false } })
										}>
										{val}
									</Button>
								</ListGroup.Item>
							))}
						</ListGroup>
					</>
				) : null}
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
		<Card style={{ height: '100%' }}>
			<Card.Header>Risposta del Giocatore</Card.Header>
			<Card.Body>
				{props.player.informations.answer &&
				Number.isInteger(parseInt(props.player.informations.status.activity)) ? (
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
