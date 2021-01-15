import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import WidgetPapiro from './Widgets/WidgetPapiro';
import WidgetNumerico from './Widgets/WidgetNumerico';

export default function Widget(props) {
	const [value, setValue] = useState('classico');
	return (
		<Row className='my-4'>
			<Col xs={6} md={4} lg={3}>
				<Form.Control
					name={props.widgetId}
					as='select'
					onChange={e => {
						setValue(e.target.value);
						props.handleInput(e.target.value, e.target.name, props.questionId, 'widget');
					}}>
					<option value='classico'>Classico</option>
					<option value='papiro'>Papiro</option>
					<option value='numerico'>Numerico</option>
				</Form.Control>
			</Col>
			<Col xs={4} sm={3} md={2}>
				{value === 'classico' ? (
					<Form.Control placeholder='Ciao a tutti!'></Form.Control>
				) : value === 'papiro' ? (
					<WidgetPapiro />
				) : (
					<WidgetNumerico />
				)}
			</Col>
		</Row>
	);
}
