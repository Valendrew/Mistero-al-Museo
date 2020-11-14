import React from "react";
import { Form, Col, Row } from "react-bootstrap";

export default function InputDomanda(props) {
	return (
		<Row className="my-4">
			<Col>
				<Form.Label>Inserisci la domanda: </Form.Label>
				<Form.Control
					name={props.id}
					value={props.value}
					type="text"
					onChange={(e) => props.handleInput(e.target.value, props.id)}
				/>
			</Col>
		</Row>
	);
}
