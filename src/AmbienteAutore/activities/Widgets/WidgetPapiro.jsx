import React from 'react';
import { Col, Form } from 'react-bootstrap';
import Papiro from './../Style/Pictures/Papyrus-psd26583.png';
import './../Style/Text.css';
export default function WidgetPapiro(props) {
	const style = {
		width: '370px',
		backgroundImage: `url(${Papiro})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100% 100%',
		padding: '12%',
		height: '550px',
		marginLeft: 'calc(50% - 185px)'
	};
	return (
		<div xs={6} style={style}>
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
