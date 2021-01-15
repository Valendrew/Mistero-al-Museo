import React from 'react';
import { Card, Col, Form, Row, Tab, Button, Image, Nav } from 'react-bootstrap';

import Placeholder from './placehold.jpg';

import styleBase from '../../AmbientePlayer/Style/style.module.css';
import styleEgypt from '../../AmbientePlayer/Style/styleEgypt.module.css';
import stylePrehistory from '../../AmbientePlayer/Style/stylePrehistory.module.css';
import styleMuseum from '../../AmbientePlayer/Style/styleMuseum.module.css';
import WidgetPapiro from '../activities/Widgets/WidgetPapiro';

function PagePreview({ style }) {
	return (
		<div
			className={style.sfondo}
			style={{ height: '50vh', overflowY: 'auto', overflowX: 'hidden' }}>
			{/* HEADER */}
			<div className={style.container}>
				<Row>
					<Col>
						<h5>Al momento ti trovi nell'attività *</h5>
					</Col>
				</Row>

				<Row>
					<Col>
						<h6>Il punteggio attuale è **</h6>
					</Col>
				</Row>
			</div>

			<Row>
				<Col>
					<Button variant='dark' className={style.bottone}>
						Apri Chat
					</Button>
				</Col>
			</Row>

			{/* NARRAZIONE */}
			<Row>
				<Col className={style.container}>
					<p className={style.paragrafo}>Questa è la parte scritta della narrazione</p>
				</Col>
			</Row>

			<Row>
				<Col className={style.backMedia}>
					<Image
						style={{ width: '20vh' }}
						src={Placeholder}
						thumbnail
						fluid
						className={style.immagine}
					/>
				</Col>
			</Row>

			<hr />
			<hr />

			{/* DOMANDA */}
			<Row>
				<Col className={style.container}>
					<p className={style.paragrafo}>Questa è la parte domanda</p>
				</Col>
			</Row>

			<Row className={style.rispostaMultipla}>
				<Form.Check type='radio' label='Risposta A' name='example_radio' defaultChecked={true} />
			</Row>
			<Row className={style.rispostaMultipla}>
				<Form.Check type='radio' label='Risposta B' name='example_radio' />
			</Row>
			<Row className={style.rispostaMultipla}>
				<Form.Check type='radio' label='Risposta C' name='example_radio' />
			</Row>
			<WidgetPapiro />
			<Button variant='dark' className={style.bottone}>
				Prosegui attività
			</Button>
		</div>
	);
}

function StoryTheme(props) {
	return (
		<Card className='mt-4'>
			<Card.Header>Scegli ambientazione del player</Card.Header>

			<Card.Body>
				<Tab.Container defaultActiveKey='generico'>
					<Row>
						<Col xs={2}>
							<Nav variant='pills' className='flex-column'>
								<Nav.Item>
									<Nav.Link onClick={() => props.setTema('generico')} eventKey='generico'>
										Classico
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link onClick={() => props.setTema('egypt')} eventKey='egypt'>
										Egitto
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link onClick={() => props.setTema('prehistory')} eventKey='prehistory'>
										Preistoria
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link onClick={() => props.setTema('museum')} eventKey='museum'>
										Museo
									</Nav.Link>
								</Nav.Item>
							</Nav>
						</Col>
						<Col xs={10}>
							<Tab.Content>
								<Tab.Pane eventKey='generico'>
									<PagePreview style={styleBase} />
								</Tab.Pane>
								<Tab.Pane eventKey='egypt'>
									<PagePreview style={styleEgypt} />
								</Tab.Pane>
								<Tab.Pane eventKey='prehistory'>
									<PagePreview style={stylePrehistory} />
								</Tab.Pane>
								<Tab.Pane eventKey='museum'>
									<PagePreview style={styleMuseum} />
								</Tab.Pane>
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</Card.Body>
		</Card>
	);
}

export default StoryTheme;
