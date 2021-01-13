import React from 'react';

import { InputGroup, Form, Button } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
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
		<Modal show={props.show} onHide={props.onHide} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>Chat</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup variant='flush'>
					{props.chat ? (
						props.chat.map((value, key) => {
							const mit = value.substr(0, 1);
							const text = value.substr(2);
							return mit === 'p' ? (
								<ListGroup.Item
									key={key}
									variant='primary'
									style={{ textAlign: 'right', borderRadius: '20px', marginLeft: '10%', marginBottom: '4px' }}>
									{text}
								</ListGroup.Item>
							) : (
								<ListGroup.Item
									key={key}
									variant='secondary'
									style={{ borderRadius: '20px', marginRight: '10%', marginBottom: '4px' }}>
									{text}
								</ListGroup.Item>
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
