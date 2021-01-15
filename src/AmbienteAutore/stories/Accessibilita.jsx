import React, { useState, useRef } from 'react';
import { Overlay, Tooltip, Form, Row, Col } from 'react-bootstrap';

function Accessibilita(props) {
	const [show, setShow] = useState(false);
	const target = useRef(null);

	return (
		<Row>
			<Col>
				<p ref={target} onMouseEnter={() => setShow(true)} onMouseOut={() => setShow(false)}>
					Spunta la casella se hai reso accessibile la storia
				</p>
				<Overlay target={target.current} show={show} placement='bottom'>
					{props => (
						<Tooltip id='overlay' {...props}>
							L'accessibilità è una proprietà che può avere la tua storia. Permette agli utenti con disabilità visive di
							poter comunque giocare. (e.g: hai messo una descrizione soddisfacente a tutte le immagini?)
						</Tooltip>
					)}
				</Overlay>
			</Col>
			<Col>
				<Form.Check
					type='checkbox'
					value={props.accessibilita}
					onChange={() => {
						props.setAccessibilita(!props.accessibilita);
					}}
				/>
			</Col>
		</Row>
	);
}

export default Accessibilita;
