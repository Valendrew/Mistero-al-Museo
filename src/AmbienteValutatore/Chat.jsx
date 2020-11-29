import React from 'react';

import { InputGroup, Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Status from './Status';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
function Chat(props) {
	const [message, setMessage] = useState();

	const fetchUpdateStatus = async e => {
		let data = props.chat;
		data ? data.push('v:' + message) : (data = ['v:' + message]);

		const result = await fetch(`/games/${props.idStory}/message/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat: data })
		});
		setMessage(null);
		props.updateStatus(props.idStory, props.id, { chat: data });
	};
	const handleChangeInput = e => {
		setMessage(e.target.value);
	};
	return (
		<Container fluid>
			<Card>
				<Card.Header>Chat</Card.Header>
				<Card.Body>
					<ListGroup variant='flush'>
						{props.chat
							? props.chat.map(value => {
									const mit = value.substr(0, 1);
									const text = value.substr(2);
									return mit == 'v' ? (
										<ListGroup.Item
											variant='primary'
											style={{ 'text-align': 'right', borderRadius: '20px', marginLeft: '10%', marginBottom: '4px' }}>
											{text}
										</ListGroup.Item>
									) : (
										<ListGroup.Item
											variant='secondary'
											style={{ borderRadius: '20px', marginRight: '10%', marginBottom: '4px' }}>
											{text}
										</ListGroup.Item>
									);
							  })
							: null}
					</ListGroup>
					<InputGroup>
						<Form.Control value={message} onChange={handleChangeInput} name='chat' />
						<InputGroup.Append>
							<Button name='invia' onClick={message ? e => fetchUpdateStatus(e) : null}>
								Invia
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Card.Body>
			</Card>
		</Container>
	);
}
export default Chat;
