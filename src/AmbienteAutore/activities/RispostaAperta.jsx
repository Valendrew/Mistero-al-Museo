import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';

function FormPunteggio(props) {
	return (
		<Row className='my-4'>
			<Col>
				<Form.Label>Inserisci punteggio {props.type}: </Form.Label>
			</Col>
			<Col>
				<Form.Control
					type='number'
					min={-50}
					max={50}
					name={props.id}
					value={props.value}
					onChange={e => props.handleInput(e.target.value, props.id)}></Form.Control>
			</Col>
		</Row>
	);
}

function RispostaAperta(props) {
	return (
		<>
			<FormPunteggio id={props.minId} value={props.minValue} type='minimo' {...props} />
			<FormPunteggio id={props.maxId} value={props.maxValue} type='massimo' {...props} />
		</>
	);
}

export default RispostaAperta;
