import React from "react";
import { Form, Col, Row } from "react-bootstrap";

export default function InputDomanda(props) {
	return (
		<Row className="my-2">
			<Col xs={6} md={4} lg={3}>
				<Form.Label>Inserisci la domanda: </Form.Label>
			</Col>
			<Col>
				<Form.Control name={props.id} value={props.value} type="text" onChange={(e) => props.handleInput(e.target.value, props.id)} />
			</Col>
		</Row>
	);
}
