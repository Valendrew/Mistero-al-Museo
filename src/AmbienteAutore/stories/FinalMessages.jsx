import React from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';

function setScore(e, message, setMessage, index, key) {
	let obj = message;
	if (obj.hasOwnProperty(index)) {
		obj[index][key] = e.target.value;
	} else {
		obj = { ...obj, [index]: { [key]: e.target.value } };
	}
	setMessage(obj);
}

function FinalMessages(props) {
	return (
		<Container fluid>
			<Form  className="mt-3 ml-3 mb-3">
				<Row>
					<Form.Label>Messeggio Conclusivo il giocatore ha fatto meno di </Form.Label>
					<Col xs={1}>
						<Form.Control
							type='number'
							onChange={e => setScore(e, props.finalMessages, props.setFinalMessages, 0, 'score')}
						/>
					</Col>
					<Form.Label> punti (giocatore non bravo)</Form.Label>
				</Row>
				<Row>
					<Col xs={4}>
						<Form.Control onChange={e => setScore(e, props.finalMessages, props.setFinalMessages, 0, 'message')} />
					</Col>
				</Row>
				<Row>
					<Form.Label>Messeggio Conclusivo il giocatore ha fatto meno di </Form.Label>
					<Col xs={1}>
						<Form.Control
							type='number'
							onChange={e => setScore(e, props.finalMessages, props.setFinalMessages, 1, 'score')}
						/>
					</Col>
					<Form.Label> punti (giocatore bravo)</Form.Label>
				</Row>
				<Row>
					<Col xs={4}>
						<Form.Control onChange={e => setScore(e, props.finalMessages, props.setFinalMessages, 1, 'message')} />
					</Col>
				</Row>
				<Row>
					<Form.Label>Messeggio conclusivo se il giocstore ha giocato benissimo</Form.Label>
				</Row>
				<Row>
					<Col xs={4}>
						<Form.Control onChange={e => setScore(e, props.finalMessages, props.setFinalMessages, 2, 'message')} />
					</Col>
				</Row>
			</Form>
		</Container>
	);
}

export default FinalMessages;
