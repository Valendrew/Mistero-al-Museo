import React from 'react';
import { Card, Col, Form, ListGroup, Row, Tab } from 'react-bootstrap';

import './Text.css';
import Papiro from './Papyrus-psd26583.png';

function ThemePreviewNature() {
	return (
		<>
			<Card>
				<Card.Header>Input di tipo testo</Card.Header>
				<Card.Body>
					<Form.Control
						style={{
							border: '0',
							color: 'white',
							backgroundImage: 'url(http://14textures.com/wp-content/uploads/2015/07/pebble-surface-2.jpg)',
							backgroundSize: 'cover'
						}}
					/>
				</Card.Body>
			</Card>

			<Card className='mt-4'>
				<Card.Header>Input di tipo radio</Card.Header>
				<Card.Body>
					<Form.Check
						type='radio'
						style={{
							backgroundImage: 'url(https://bgfons.com/uploads/leaves/leaves_texture4972.jpg)',
							backgroundSize: 'cover'
						}}>
						<Form.Check.Input type='radio' />
						<Form.Check.Label className='text-white'>Vaffanculo ammat</Form.Check.Label>
					</Form.Check>
				</Card.Body>
			</Card>
		</>
	);
}

function ThemePreview() {
	const style = {
		backgroundImage: `url(${Papiro})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100% 100%',
		padding: '12%'
	};

	return (
		<Col xs={6} style={style}>
			<Form.Control className="papiro" as='textarea' maxLength="230" id='widget' rows={14} />
		</Col>
	);
}

function StoryTheme() {
	return (
		<Row>
			<Col xs={12}>
				<Card>
					<Card.Header>Scegli ambientazione del player</Card.Header>

					<Card.Body>
						<Tab.Container defaultActiveKey='link1'>
							<Row>
								<Col sm={4}>
									<ListGroup>
										<ListGroup.Item action eventKey='link1'>
											Natura
										</ListGroup.Item>
										<ListGroup.Item action eventKey='link2'>
											Link 2
										</ListGroup.Item>
									</ListGroup>
								</Col>
								<Col sm={8}>
									<Tab.Content>
										<Tab.Pane eventKey='link1'>
											<ThemePreviewNature />
										</Tab.Pane>
										<Tab.Pane eventKey='link2'>
											<ThemePreview />
										</Tab.Pane>
									</Tab.Content>
								</Col>
							</Row>
						</Tab.Container>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}

export default StoryTheme;
