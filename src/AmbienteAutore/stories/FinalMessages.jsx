import React, { useState } from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

function InputMessage(props) {
	return (
		<Col xs={4}>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>Messaggio:</InputGroup.Text>
				</InputGroup.Prepend>

				<Form.Control
					value={props.inputs[`message_${props.id}`] || ''}
					onChange={e => props.setScore(e, props.id, 'message')}
				/>
			</InputGroup>
		</Col>
	);
}

function FinalMessages(props) {
	const [inputs, setInputs] = useState({ score_0: 0, score_1: 1 });

	const setScore = (e, index, key) => {
		let newFinalMsgs = { ...props.finalMessages };
		let newInputs = {};

		const addToFinalMsgs = (i, value) => {
			if (newFinalMsgs.hasOwnProperty(i)) {
				newFinalMsgs[i][key] = value;
			} else {
				newFinalMsgs = { ...newFinalMsgs, [i]: { [key]: value } };
			}
		};

		if (index === 0 && key === 'score' && parseInt(e.target.value) >= parseInt(inputs['score_1'])) {
			const nextValue = (parseInt(e.target.value) + 1).toString();

			newInputs = { [`${key}_1`]: nextValue };
			addToFinalMsgs(1, nextValue);
		}
		if (index === 1 && key === 'score' && parseInt(e.target.value) <= parseInt(inputs['score_0'])) {
			const prevValue = (parseInt(e.target.value) - 1).toString();

			newInputs = { [`${key}_0`]: prevValue };
			addToFinalMsgs(1, prevValue);
		}

		newInputs = { ...newInputs, [`${key}_${index}`]: e.target.value };
		setInputs({ ...inputs, ...newInputs });

		addToFinalMsgs(index, e.target.value);
		props.setFinalMessages(newFinalMsgs);
	};

	return (
		<>
			<Row className='my-4'>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>Se il giocatore ha ottenuto un punteggio inferiore a </Form.Label>
					</InputGroup.Prepend>
					<Col xs={1}>
						<Form.Control
							type='number'
							defaultValue={0}
							min={0}
							value={inputs['score_0'] || 0}
							onChange={e => setScore(e, 0, 'score')}
						/>
					</Col>
					<InputGroup.Append>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}> punti (giocatore non bravo)</Form.Label>
					</InputGroup.Append>
				</InputGroup>
			</Row>

			<Row className='mb-4'>
				<InputMessage inputs={inputs} setScore={setScore} id={0} />
			</Row>

			<Row className='mb-4'>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
							Se il giocatore ha ottenuto un punteggio compreso tra {inputs['score_0'] || 0} e
						</Form.Label>
					</InputGroup.Prepend>

					<Col xs={1}>
						<Form.Control
							type='number'
							defaultValue={1}
							min={1}
							value={inputs['score_1'] || 1}
							onChange={e => setScore(e, 1, 'score')}
						/>
					</Col>

					<InputGroup.Append>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}> punti (giocatore bravo)</Form.Label>
					</InputGroup.Append>
				</InputGroup>
			</Row>

			<Row className='mb-4'>
				<InputMessage inputs={inputs} setScore={setScore} id={1} />
			</Row>

			<Row className='mb-4'>
				<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
					Se il giocatore ha ottenuto un punteggio superiore a {inputs['score_1'] || 1} (ha giocato benissimo)
				</Form.Label>
			</Row>

			<Row>
				<InputMessage inputs={inputs} setScore={setScore} id={2} />
			</Row>
		</>
	);
}

export default FinalMessages;
