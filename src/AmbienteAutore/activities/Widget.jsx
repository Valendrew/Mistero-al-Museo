import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import WidgetPapiro from '../../Widgets/WidgetPapiro';
import WidgetNumerico from '../../Widgets/WidgetNumerico';

export default function Widget(props) {
	const [value, setValue] = useState('classico');
	return (
		<Row className='my-4'>
			<Col xs={4}>
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
			<Col xs={8} style={{ maxHeight: '25vh', overflowY: 'scroll' }}>
				{value === 'classico' ? (
					<Form.Control placeholder='Esempio di testo'></Form.Control>
				) : value === 'papiro' ? (
					<WidgetPapiro />
				) : value === 'numerico' ? (
					<WidgetNumerico />
				) : null}
			</Col>
		</Row>
	);
}
