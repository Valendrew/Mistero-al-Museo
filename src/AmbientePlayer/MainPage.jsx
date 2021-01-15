import React from 'react';

import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';

function MainPage(props) {
	return (
		<main>
			<Row>
				<Col className={props.style.container}>
					<h2>Nome storia</h2>
					<p className={props.style.paragrafo}>{props.name}</p>
				</Col>
			</Row>

			<Row>
				<Col className={props.style.container}>
					<h2>Descrizione storia</h2>
					<p className={props.style.paragrafo}>{props.description}</p>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button variant='dark' onClick={props.startGame} className={props.style.bottone}>
						Inizia la partita
					</Button>
				</Col>
			</Row>
		</main>
	);
}

export default MainPage;
