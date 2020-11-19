import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

function TipListItem(props) {
	return (
		<Row className='my-4'>
			<Col>
				<Form.Label>Inserisci l'aiuto numero {props.index}: </Form.Label>
			</Col>
			<Col>
				<Form.Control
					type='text'
					name={props.id}
					value={props.value}
					onChange={e => props.handleInput(e.target.value, props.id)}
				/>
			</Col>
		</Row>
	);
}
export default function Tips(props) {
	return (
		<>
			<Row className='my-4'>
				<Col xs={6} md={4} lg={3}>
					<Form.Label>Numero suggerimenti</Form.Label>
				</Col>
				<Col xs={4} sm={3} md={2}>
					<Form.Control
						name={props.rangeId}
						value={props.inputs[props.rangeId].value}
						type='number'
						min='0'
						max='5'
						onChange={e => props.handleInput(e.target.value, props.rangeId, props.questionId, 'tips')}></Form.Control>
				</Col>
			</Row>
			{Object.entries(props.tips).map(([key, val]) => {
				return (
					<TipListItem key={key} handleInput={props.handleInput} index={key} id={val} value={props.inputs[val].value} />
				);
			})}
		</>
	);
}
