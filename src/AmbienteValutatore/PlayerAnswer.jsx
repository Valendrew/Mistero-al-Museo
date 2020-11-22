import React, { useState, useEffect } from 'react';

import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function PlayerAnswer(props) {
	const [placeHolder, setPlaceHolder] = useState('Nessuna risposta da visualizzare...');

	return (
		<Container fluid>
			<Card>
				<Card.Header>Risposta del Giocatore</Card.Header>
				<Card.Body>
					<Form.Control
						as='textarea'
						cols={10}
						rows={4}
						placeholder={placeHolder}
						style={{ resize: 'none' }}
						readOnly></Form.Control>
				</Card.Body>
			</Card>
		</Container>
	);
}
export default PlayerAnswer;
