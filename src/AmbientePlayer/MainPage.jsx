import React from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputNumerico from './Game/Widget/InputNumerico';
import { Row } from 'react-bootstrap';
function MainPage(props) {
	return (
		<>
			<Row >
				<Card>
					<Card.Header>{props.name}</Card.Header>
					<Card.Body>{props.description}</Card.Body>
					<Card.Footer>
						<Button onClick={props.startGame}>Inizia la partita</Button>
					</Card.Footer>
				</Card>
			</Row>

			<InputNumerico />
		</>
	);
}

export default MainPage;
