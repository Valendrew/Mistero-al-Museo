import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

function InputMessage(props) {
	return (
		<Col xs={12}>
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text>Messaggio:</InputGroup.Text>
				</InputGroup.Prepend>

				<Form.Control
					value={props.finalMessages[props.id]['message']}
					onChange={e => props.setScore(e, props.id, 'message')}
				/>
			</InputGroup>
		</Col>
	);
}

function FinalMessages(props) {
	const setScore = (e, index, key) => {
		let newFinalMsgs = { ...props.finalMessages };

		const addToFinalMsgs = (i, value) => {
			if (newFinalMsgs.hasOwnProperty(i)) {
				newFinalMsgs[i][key] = value;
			} else {
				newFinalMsgs = { ...newFinalMsgs, [i]: { [key]: value } };
			}
		};

		if (
			index === 0 &&
			key === 'score' &&
			parseInt(e.target.value) >= parseInt(props.finalMessages['1']['score'])
		) {
			const nextValue = (parseInt(e.target.value) + 1).toString();

			addToFinalMsgs(1, nextValue);
		}
		if (
			index === 1 &&
			key === 'score' &&
			parseInt(e.target.value) <= parseInt(props.finalMessages['0']['score'])
		) {
			const prevValue = (parseInt(e.target.value) - 1).toString();

			addToFinalMsgs(0, prevValue);
		}
		addToFinalMsgs(index, e.target.value);
		props.setFinalMessages(newFinalMsgs);
	};

	return (
		<>
			<Row className='my-4'>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
							Se il giocatore ha ottenuto un punteggio inferiore a{' '}
						</Form.Label>
					</InputGroup.Prepend>
					<Col xs={1}>
						<Form.Control
							type='number'
							min={0}
							value={props.finalMessages['0']['score']}
							onChange={e => setScore(e, 0, 'score')}
						/>
					</Col>
					<InputGroup.Append>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
							{' '}
							punti (giocatore non bravo)
						</Form.Label>
					</InputGroup.Append>
				</InputGroup>
			</Row>

			<Row className='mb-4'>
				<InputMessage finalMessages={props.finalMessages} setScore={setScore} id={0} />
			</Row>

			<Row className='mb-4'>
				<InputGroup>
					<InputGroup.Prepend>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
							Se il giocatore ha ottenuto un punteggio compreso tra{' '}
							{props.finalMessages['0']['score']} e
						</Form.Label>
					</InputGroup.Prepend>

					<Col xs={1}>
						<Form.Control
							type='number'
							min={1}
							value={props.finalMessages['1']['score']}
							onChange={e => setScore(e, 1, 'score')}
						/>
					</Col>

					<InputGroup.Append>
						<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
							{' '}
							punti (giocatore bravo)
						</Form.Label>
					</InputGroup.Append>
				</InputGroup>
			</Row>

			<Row className='mb-4'>
				<InputMessage finalMessages={props.finalMessages} setScore={setScore} id={1} />
			</Row>

			<Row className='mb-4'>
				<Form.Label style={{ display: 'flex', alignItems: 'center' }}>
					Se il giocatore ha ottenuto un punteggio superiore a {props.finalMessages['1']['score']}{' '}
					(ha giocato benissimo)
				</Form.Label>
			</Row>

			<Row>
				<InputMessage finalMessages={props.finalMessages} setScore={setScore} id={2} />
			</Row>
		</>
	);
}

export default FinalMessages;
