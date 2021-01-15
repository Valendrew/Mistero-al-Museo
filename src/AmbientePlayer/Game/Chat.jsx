import React from 'react';

import { InputGroup, Form, Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { Fragment } from 'react';

function Chat(props) {
	const [message, setMessage] = useState('');

	const fetchUpdateChat = async e => {
		props.handleSendMessage(message);
		setMessage('');
	};
	const handleChangeInput = e => {
		setMessage(e.target.value);
	};
	return (
		<Modal
			show={props.show.state}
			onHide={props.onHide}
			dialogClassName='modal-lg'
			role='dialog'
			aria-labelledby='chat_modal'
			centered>
			<Modal.Header>
				<Modal.Title id='chat_modal' className={props.style.paragrafoalt}>
					Chat con il valutatore
				</Modal.Title>
			</Modal.Header>
			<Modal.Body role='document'>
				<InputGroup>
					<Form.Control value={message} onChange={handleChangeInput} name='chat' />
					<InputGroup.Append>
						<Button
							name='invia'
							variant='light'
							className={props.style.bottonealt}
							onClick={message ? e => fetchUpdateChat(e) : null}>
							Invia messaggio
						</Button>
					</InputGroup.Append>
				</InputGroup>

				<ListGroup className='mt-4' style={{ height: '35vh', overflowY: 'scroll' }} variant='flush'>
					{props.chat.length ? (
						props.chat.map((value, key) => {
							const mit = value.substr(0, 1);
							const text = value.substr(2);

							return (
								<Fragment key={key}>
									{props.chat.length - props.show.msg === key ? <hr /> : null}
									{mit === 'p' ? (
										<ListGroup.Item
											variant='primary'
											style={{ textAlign: 'right', borderRadius: '20px', marginLeft: '10%', marginBottom: '4px' }}>
											<span className='sr-only'>Valutatore: </span>
											<p className={props.style.paragrafoalt}>{text}</p>
										</ListGroup.Item>
									) : (
										<ListGroup.Item
											variant='secondary'
											
											style={{ borderRadius: '20px', marginRight: '10%', marginBottom: '4px' }}>
											<span className='sr-only'>Tu: </span>
											<p className={props.style.paragrafoalt}>{text}</p>
										</ListGroup.Item>
									)}
								</Fragment>
							);
						})
					) : (
						<>{props.idStory}</>
					)}
				</ListGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='light' className={props.style.bottonealt} onClick={props.onHide}>
					Chiudi la chat
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
export default Chat;
