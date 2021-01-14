import React from 'react';

import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';

function MainPage(props) {
	return (
		<main className='mt-4'>
			<Row>
				<Col className={`m-2 ${props.style.container}`}>
					<h2 className={props.style.paragrafo}>Nome storia</h2>
					<p className={props.style.paragrafo}>{props.name}</p>
				</Col>
			</Row>

			<Row>
				<Col className={`m-2 ${props.style.container}`}>
					<h2 className={props.style.paragrafo}>Descrizione storia</h2>
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
