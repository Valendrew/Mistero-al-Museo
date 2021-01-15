import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

/* import style from '../Style/tastierino.module.css'; */

function aumentaValore(index, valoreAttuale, setValue, onChangeAnswer) {
	let oldVal = valoreAttuale;
	let valToMod = parseInt(valoreAttuale[index]);
	if (valToMod === 9) valToMod = 0;
	else valToMod++;
	oldVal = oldVal.substr(0, index) + valToMod.toString() + oldVal.substring(index + 1);
	setValue(oldVal);
	if (onChangeAnswer) {
		onChangeAnswer(0, oldVal);
	}
}

function decrementaValore(index, valoreAttuale, setValue, onChangeAnswer) {
	let oldVal = valoreAttuale;
	let valToMod = parseInt(valoreAttuale[index]);
	if (valToMod === 0) valToMod = 9;
	else valToMod--;
	oldVal = oldVal.substr(0, index) + valToMod.toString() + oldVal.substring(index + 1);
	setValue(oldVal);
	if (onChangeAnswer) {
		onChangeAnswer(0, oldVal);
	}
}

function UpArrow(props) {
	return (
		<svg
			onClick={() =>
				aumentaValore(props.index, props.valoreAttuale, props.setValue, props.onChangeAnswer)
			}
			width='90'
			height='90'
			class='bi bi-arrow-up-circle-fill'
			viewBox='0 0 16 16'>
			<path d='M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z' />
		</svg>
	);
}
function DownArrow(props) {
	return (
		<svg
			onClick={() =>
				decrementaValore(props.index, props.valoreAttuale, props.setValue, props.onChangeAnswer)
			}
			width='90'
			height='90'
			class='bi bi-arrow-down-circle-fill'
			viewBox='0 0 16 16'>
			<path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z' />
		</svg>
	);
}

function WidgetNumerico(props) {
	const [value, setValue] = useState('0000');

	return (
		<div className='bg-secondary' style={{ width: '600px', borderRadius: '39px' }}>
			<Row>
				<Col>
					<UpArrow index={0} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<UpArrow index={1} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<UpArrow index={2} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<UpArrow index={3} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Form.Control
						name='open_question'
						readOnly
						defaultValue='0000'
						value={value}
						className='mt-3 mb-3 bg-secondary'
						style={{ letterSpacing: '96px', fontSize: '110px', border: '0px', color: 'limegreen' }}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<DownArrow index={0} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<DownArrow index={1} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<DownArrow index={2} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
				<Col>
					<DownArrow index={3} valoreAttuale={value} setValue={setValue} {...props} />
				</Col>
			</Row>
		</div>
	);
}

export default WidgetNumerico;
