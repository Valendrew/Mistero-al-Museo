import React from 'react';
import { useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

function Status(props) {
	const [inputs, setInputs] = useState({ name: { value: props.status.name, error: false } });
	const optionsDate = { dateStyle: 'short' };
	const optionsTime = { timeStyle: 'medium' };

	const fetchUpdateStatus = async e => {
		const inputID = e.target.name.split('_')[1];
		const statusToUpdate = { [inputID]: inputs[inputID].value };
		const result = await fetch(`/games/${props.idStory}/players/${props.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(statusToUpdate)
		});
		if (!result.ok) setInputs({ ...inputs, [inputID]: { ...inputs[inputID], error: true } });
		else {
			props.updateStatus(props.idStory, statusToUpdate);
			//setInputs({ ...inputs, [inputID]: { ...inputs[inputID], error: false } });
		}
	};

	const handleChangeInput = e => {
		setInputs({ ...inputs, [e.target.name]: { error: null, value: e.target.value } });
	};

	return (
		<Card>
			<Card.Header>Stato del giocatore</Card.Header>
			<Card.Body>
				<Row>
					<Col>Stato attuale</Col>
					<Col xs={6}>
						{props.status.state === 'start'
							? 'Deve iniziare la partita'
							: props.status.state === 'end_game'
							? 'Ha terminato la partita'
							: `Attività ${props.status.state}`}
					</Col>
				</Row>
				<Row className='mt-4'>
					<Col>Nome del giocatore</Col>
					<Col xs={6}>
						<InputGroup>
							<Form.Control name='name' value={inputs.name.value} onChange={handleChangeInput} />
							<InputGroup.Append>
								<Button name='button_name' onClick={e => fetchUpdateStatus(e)}>
									Modifica
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Row>
				{inputs.name.error ? (
					<Row>
						<Col className='text-danger' xs={{ offset: 6 }}>
							Errore nella richiesta, riprova tra poco
						</Col>
					</Row>
				) : null}
				<Row className='mt-4'>
					<Col>Orario di inizio partita:</Col>
					<Col>
						Il {new Date(props.status.dateStart).toLocaleDateString('it-IT', optionsDate)} alle{' '}
						{new Date(props.status.dateStart).toLocaleTimeString('it-IT', optionsTime)}
					</Col>
				</Row>
				<Row className='mt-4'>
					<Col>Tempo nella fase attuale:</Col>
					<Col>
						{new Date(new Date() - Date.parse("1970-01-01T02:00:00") - new Date(props.status.dateActivity)).toLocaleTimeString('it-IT', optionsTime)}
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default Status;
