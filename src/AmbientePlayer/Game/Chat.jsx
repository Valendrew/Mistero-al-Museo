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
		<Modal show={props.show.state} onHide={props.onHide} size='lg' role='dialog' aria-labelledby='chat_modal' centered>
			<Modal.Header>
				<Modal.Title id='chat_modal'>Chat con il valutatore</Modal.Title>
			</Modal.Header>
			<Modal.Body role='document'>
				<ListGroup variant='flush'>
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
											{text}
										</ListGroup.Item>
									) : (
										<ListGroup.Item
											variant='secondary'
											style={{ borderRadius: '20px', marginRight: '10%', marginBottom: '4px' }}>
											{text}
										</ListGroup.Item>
									)}
								</Fragment>
							);
						})
					) : (
						<>{props.idStory}</>
					)}
				</ListGroup>
				<InputGroup>
					<Form.Control value={message} onChange={handleChangeInput} name='chat' />
					<InputGroup.Append>
						<Button name='invia' onClick={message ? e => fetchUpdateChat(e) : null}>
							Invia
						</Button>
					</InputGroup.Append>
				</InputGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
export default Chat;
