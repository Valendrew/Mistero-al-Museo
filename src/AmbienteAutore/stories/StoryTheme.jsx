import React from 'react';
import { Card, Col, Form, ListGroup, Row, Tab, Button, Image } from 'react-bootstrap';

import './Text.css';
import Papiro from './Papyrus-psd26583.png';
import Smarthphone from './smarthphone.png';
import Placeholder from './placehold.jpg';
import styleEgypt from '../../AmbientePlayer/Game/Style/styleEgypt.module.css';

function ThemePreviewEgypt() {
	return <></>;
}

function ThemePreview() {
	const style = {
		width: '370px',
		backgroundImage: `url(${Papiro})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100% 100%',
		padding: '12%',
		height: '550px'
	};

	return (
		<div xs={6} style={style}>
			<Col>
				<Form.Control className='papiro' as='textarea' spellcheck='false' maxLength='230' id='widget' rows={14} />
			</Col>
		</div>
	);
}

function StoryTheme() {
	const style = {
		width: '360px',
		height: '640px'
	};
	const storystyle = styleEgypt;
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
											Egitto
										</ListGroup.Item>
										<ListGroup.Item action eventKey='link2'>
											Link 2
										</ListGroup.Item>
									</ListGroup>
								</Col>
								<Col sm={8}>
									<Tab.Content>
										<div className={storystyle.sfondo} style={style}>
											<Button className={storystyle.bottone} style={{width:'100px'}}>Chat</Button>
											<p className={storystyle.paragrafo}>
												<h5>Al momento ti trovi nell'attività *</h5>
												<h6>Il punteggio attuale è **</h6>
											</p>
											<hr /> 
											<div className={storystyle.backMedia}>
												<Image width='150px' src={Placeholder} thumbnail fluid />
											</div>
											<hr /> 
											<p className={storystyle.paragrafo}><h6>Questa è la parte scritta della narrazione</h6></p>
											<hr /> 
											<p className={storystyle.paragrafo}><h6>Questa è la parte domanda</h6></p>
											<hr /> 
										</div>
										<Tab.Pane eventKey='link1'></Tab.Pane>
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
