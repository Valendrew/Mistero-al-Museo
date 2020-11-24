import React, { useState, useEffect } from 'react';

import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function AnswerBody(props) {
	return (
		<Form.Control
			as='textarea'
			cols={10}
			rows={4}
			placeholder={props.inputs.answer.value}
			style={{ resize: 'none' }}
			readOnly />
	);
}

function PlayerAnswer(props) {
	return (
		<Container fluid>
			<Card>
				<Card.Header>Risposta del Giocatore</Card.Header>
				<Card.Body>{props.answer ? <AnswerBody {...props} /> : null}</Card.Body>
			</Card>
		</Container>
	);
}
export default PlayerAnswer;
