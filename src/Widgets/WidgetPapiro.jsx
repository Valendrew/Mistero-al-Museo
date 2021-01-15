import React from 'react';
import { Col, Form } from 'react-bootstrap';

import style from '../Style/papiro.module.css';

export default function WidgetPapiro(props) {
	return (
		<div xs={6} style={style.ain}>
			<Col>
				{props.inputsQuestion ? (
					<Form.Control
						name='open_question'
						className='papiro'
						as='textarea'
						spellcheck='false'
						maxLength='230'
						id='widget'
						rows={14}
						value={props.inputsQuestion[0].value}
						onChange={e => props.onChangeAnswer(0, e.target.value)}
					/>
				) : (
					<Form.Control
						className='papiro'
						as='textarea'
						spellcheck='false'
						maxLength='230'
						id='widget'
						rows={14}
						placeholder='Ciao a tutti!'
					/>
				)}
			</Col>
		</div>
	);
}
