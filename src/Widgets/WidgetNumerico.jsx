import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

import style from '../Style/tastierino.module.css';

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
		<div className={style.main}>
			<div className={style.containeralt}>
				<UpArrow index={0} valoreAttuale={value} setValue={setValue} {...props} />
				<UpArrow index={1} valoreAttuale={value} setValue={setValue} {...props} />
				<UpArrow index={2} valoreAttuale={value} setValue={setValue} {...props} />
				<UpArrow index={3} valoreAttuale={value} setValue={setValue} {...props} />
			</div>
			<div className={style.container}>
				<Form.Control
					name='open_question'
					readOnly
					className={style.tastierino}
					defaultValue='0000'
					value={value}
				/>
			</div>
			<div className={style.containeralt}>
				<DownArrow index={0} valoreAttuale={value} setValue={setValue} {...props} />
				<DownArrow index={1} valoreAttuale={value} setValue={setValue} {...props} />
				<DownArrow index={2} valoreAttuale={value} setValue={setValue} {...props} />
				<DownArrow index={3} valoreAttuale={value} setValue={setValue} {...props} />
			</div>
		</div>
	);
}

export default WidgetNumerico;
