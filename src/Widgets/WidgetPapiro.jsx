import React from 'react';
import { Form } from 'react-bootstrap';

import style from '../Style/papiro.module.css';

export default function WidgetPapiro(props) {
	const isFunctional = props.inputsQuestion ? true : false;

	return (
		<div className={style.main}>
			<Form.Control
				name='open_question'
				className={style.papiro}
				as='textarea'
				id='widget'
				rows={8}
				resiz
				value={isFunctional ? props.inputsQuestion[0].value : 'Esempio di testo'}
				onChange={e => {
					if (isFunctional) props.onChangeAnswer(0, e.target.value);
					else e.preventDefault();
				}}
			/>
		</div>
	);
}
