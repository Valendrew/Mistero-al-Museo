import React from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

function getTimeFormatted(timeMS) {
	const hours = Math.floor(timeMS / (1000 * 3600));
	const minutes = Math.floor(timeMS / (1000 * 60)) - hours * 60;
	const seconds = Math.floor(timeMS / 1000) - hours * 3600 - minutes * 60;
	return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function Status(props) {
	const optionsDate = { dateStyle: 'short' };
	const optionsTime = { timeStyle: 'medium' };

	const fetchUpdateStatus = async e => {
		//const inputID = e.target.name.split('_')[1];
		const statusToUpdate = { name: props.inputs.name.value };

		/* Viene fatta la richiesta al server per modificare il nome */
		const result = await fetch(`/games/${props.player.story}/players/${props.player.id}/name`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(statusToUpdate)
		});

		if (!result.ok) props.setInputs({ ...props.inputs, name: { ...props.inputs.name, error: true } });
		else {
			props.updateStatus(props.player.story, props.player.id, { name: props.inputs.name.value });
			//props.setInputs({ ...props.inputs, name: { ...props.inputs.name, error: false } });
		}
	};

	const handleChangeInput = e => {
		props.setInputs({ ...props.inputs, [e.target.name]: { error: null, value: e.target.value } });
	};

	return (
		<Card>
			<Card.Header>Stato del giocatore</Card.Header>
			<Card.Body>
				<Row>
					<Col>Stato attuale</Col>
					<Col xs={6}>
						{props.player.informations.status.activity === 'start'
							? 'Deve iniziare la partita'
							: props.player.informations.status.activity === 'end_game'
							? 'Ha terminato la partita'
							: `Attività ${props.player.informations.status.activity}`}
					</Col>
				</Row>

				<Row className='mt-4'>
					<Col>Nome del giocatore</Col>
					<Col xs={6}>
						<InputGroup>
							<Form.Control name='name' value={props.inputs.name.value} onChange={handleChangeInput} />
							<InputGroup.Append>
								<Button name='button_name' onClick={e => fetchUpdateStatus(e)}>
									Modifica
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Row>
				{props.inputs.name.error ? (
					<Row>
						<Col className='text-danger' xs={{ offset: 6 }}>
							Errore nella richiesta, riprova tra poco
						</Col>
					</Row>
				) : null}

				<Row className='mt-4'>
					<Col>Punteggio</Col>
					<Col xs={6}>{props.player.informations.status.score}</Col>
				</Row>

				<Row className='mt-4'>
					<Col>Orario di inizio partita:</Col>
					<Col>
						Il {new Date(props.player.informations.info.dateStart).toLocaleDateString('it-IT', optionsDate)} alle{' '}
						{new Date(props.player.informations.info.dateStart).toLocaleTimeString('it-IT', optionsTime)}
					</Col>
				</Row>

				{props.player.informations.status.interval ? (
					<Row className='mt-4'>
						<Col>Tempo nella fase attuale:</Col>
						<Col>{getTimeFormatted(props.player.informations.status.interval)}</Col>
					</Row>
				) : null}
			</Card.Body>
		</Card>
	);
}

export default Status;
