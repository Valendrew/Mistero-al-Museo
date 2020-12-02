import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export default function Rating(props) {
	return (
		<>
			<Row className='my-4'>
				<Col xs={6} md={4} lg={3}>
					<Form.Label>Punteggio dinamico</Form.Label>
				</Col>
				<Col xs={4} sm={3} md={2}>
					<Form.Check
						name={props.dinamicRatingId}
						type='checkBox'
						value={props.inputs[props.dinamicRatingId].value}
						defaultChecked={props.inputs[props.dinamicRatingId].value}
						onChange={e => props.handleInput(e.target.checked, e.target.name, props.questionId, 'tips')}
					/>
				</Col>
			</Row>
		</>
	);
}
