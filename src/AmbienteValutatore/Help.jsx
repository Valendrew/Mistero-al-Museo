import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

function HelpBody(props) {
	const [radioButtons, setRadioButtons] = useState(Array.from({ length: props.question.tips.length + 1 }, v => false));
	const answerIndex = props.player.informations.help.index;

	const handleRadioButtons = (index, value) => {
		setRadioButtons(radioButtons.map((_, key) => (index === key ? value : false)));
	};

	const handleSendHelp = e => {
		e.preventDefault();

		const indexOfTip = radioButtons.findIndex(value => value === true);

		if (indexOfTip >= 0) {
			let tipValue;

			if (indexOfTip === props.question.tips.length) {
				tipValue = props.inputs.manualHelp.value;
			} else {
				tipValue = props.question.tips[indexOfTip];
			}

			props.sendHelpToPlayer(tipValue, props.player.story, props.player.id);
		}
	};

	return (
		<>
			L'utente alla domanda <b>{props.question.value}</b> ha risposto:{' '}
			<b>
				{props.question.type === 'radio'
					? props.question.answers[answerIndex].value
					: props.question.type === 'open'
					? props.player.informations.help
					: null}
			</b>
			<hr />
			<h6>Suggerimenti disponibili:</h6>
			<Form onSubmit={handleSendHelp}>
				{props.question.tips.map((value, key) => (
					<Form.Check
						key={key}
						type='radio'
						name='help'
						label={value}
						defaultChecked={false}
						onChange={e => handleRadioButtons(key, e.target.checked)}
					/>
				))}

				<Form.Check type='radio' name='help'>
					<Form.Check.Input
						type='radio'
						name='help'
						defaultChecked={false}
						onChange={e => handleRadioButtons(props.question.tips.length, e.target.checked)}
					/>
					<Form.Check.Label name='help'>
						<Form.Control
							name='manualHelp'
							value={props.inputs.manualHelp ? props.inputs.manualHelp.value : ''}
							onChange={e => {
								e.stopPropagation();
								props.setInputs({ ...props.inputs, manualHelp: { value: e.target.value, error: false } });
							}}
						/>
					</Form.Check.Label>
				</Form.Check>

				<Button type='submit'>Invia aiuto</Button>
			</Form>
		</>
	);
}

function Help(props) {
	const activity = props.player.informations.status.activity;
	let question = null;

	if (Number.isInteger(parseInt(activity))) {
		question = props.story.activities[activity].questions;

		if (question.length) question = question[0];
	}

	return (
		<Card>
			<Card.Header>Aiuti e suggerimenti</Card.Header>
			<Card.Body>
				{props.player.informations.help && question ? <HelpBody {...props} question={question} /> : null}
			</Card.Body>
		</Card>
	);
}

export default Help;
