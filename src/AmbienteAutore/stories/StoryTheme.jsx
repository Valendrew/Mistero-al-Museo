import React, { useState } from 'react';
import { Card, Col, Form, ListGroup, Row, Tab, Button, Image, Container } from 'react-bootstrap';

import Placeholder from './placehold.jpg';
import styleEgypt from '../../AmbientePlayer/Style/styleEgypt.module.css';
import stylePrehistory from '../../AmbientePlayer/Style/stylePrehistory.module.css';
import styleBase from '../../AmbientePlayer/Style/style.module.css';
import styleMuseum from '../../AmbientePlayer/Style/styleMuseum.module.css';

function StoryTheme(props) {
	const style = {
		width: '360px',
		height: '640px',
		overflowY: 'scroll',
		border: 'black solid 2px',
		position: 'relative',
		zndex: '20'
	};
	const [storystyle, setStoryStyle] = useState(styleBase);
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
										<ListGroup.Item
											action
											eventKey='link1'
											onClick={() => {
												setStoryStyle(styleBase);
												props.setTema('generico');
											}}>
											Classico
										</ListGroup.Item>
										<ListGroup.Item
											action
											eventKey='link2'
											onClick={() => {
												setStoryStyle(styleEgypt);
												props.setTema('egypt');
											}}>
											Egitto
										</ListGroup.Item>
										<ListGroup.Item
											action
											eventKey='link3'
											onClick={() => {
												setStoryStyle(stylePrehistory);
												props.setTema('prehistory');
											}}>
											Preistoria
										</ListGroup.Item>
										<ListGroup.Item
											action
											eventKey='link43'
											onClick={() => {
												setStoryStyle(styleMuseum);
												props.setTema('museum');
											}}>
											Museo
										</ListGroup.Item>
									</ListGroup>
								</Col>
								<Col sm={8}>
									<Tab.Content>
										<Container className={storystyle.sfondo} style={style} fluid>
											<Button className={storystyle.bottone} style={{ width: '90px' }}>
												Chat
											</Button>
											<Row>
												<Col className={storystyle.container}>
													<p className={storystyle.paragrafo}>
														<h5>Al momento ti trovi nell'attività *</h5>
														<h6>Il punteggio attuale è **</h6>
													</p>
												</Col>
											</Row>
											<hr />
											<Row>
												<Col className={storystyle.backMedia}>
													<Image width='150px' src={Placeholder} thumbnail fluid />
												</Col>
											</Row>
											<hr />
											<Row>
												<Col className={storystyle.container}>
													<p className={storystyle.paragrafo}>Questa è la parte scritta della narrazione</p>
												</Col>
											</Row>
											<hr />
											<Row>
												<Col className={storystyle.container}>
													<p className={storystyle.paragrafo}>Questa è la parte domanda</p>
												</Col>
											</Row>
											<hr />
											<Row className={storystyle.rispostaMultipla}>
												<Form.Check type='radio' label='Risposta A' name='example_radio' defaultChecked={true} />
											</Row>
											<Row className={storystyle.rispostaMultipla}>
												<Form.Check type='radio' label='Risposta B' name='example_radio' />
											</Row>
											<Row className={storystyle.rispostaMultipla}>
												<Form.Check type='radio' label='Risposta C' name='example_radio' />
											</Row>
											<Button className={storystyle.bottone} style={{ width: '130px' }}>
												Prosegui attività
											</Button>
										</Container>
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
