import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { Spinner } from 'react-bootstrap';

import ExportData from './ExportData';
import ShowRanking from './ShowRanking';

function PlayerList(props) {
	return (
		<ListGroup variant='flush'>
			{Object.entries(props.players).map(([key, value]) => {
				let spinners = [];

				if (value.answer) {
					spinners.push(
						<Spinner
							key='spinner_1'
							className='mx-2'
							animation='grow'
							variant='warning'
							title='Risposta da valutare'
						/>
					);
				}
				if (value.status.interval > 1000 * 60 * 5) {
					spinners.push(
						<Spinner
							key='spinner_2'
							className='mx-2'
							animation='grow'
							variant='info'
							title='Player da troppo tempo in attesa'
						/>
					);
				}

				if (value.help) {
					spinners.push(
						<Spinner
							key='spinner_3'
							className='mx-2'
							animation='grow'
							variant='dark'
							title='Aiuto richiesto dal player'
						/>
					);
				}

				return (
					<ListGroup.Item
						key={key}
						action
						onClick={() => {
							props.setPlayer(key, value, props.id);
							props.setRanking(false);
						}}>
						{value.name}
						{spinners.map(spin => spin)}
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
}
function ListStories(props) {
	return (
		<Accordion defaultActiveKey={props.id}>
			<Card>
				<Accordion.Toggle as={Card.Header} variant='light' eventKey={props.id}>
					{props.name}
				</Accordion.Toggle>

				<Accordion.Collapse eventKey={props.id}>
					<Card.Body>
						<Row>
							<ExportData players={props.players} storyID={props.id} />
							<ShowRanking
								setRanking={props.setRanking}
								setStorySelected={props.setStorySelected}
								stories={props.stories}
								storyID={props.id}
							/>
						</Row>

						<PlayerList {...props} />
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

function SideBar(props) {
	return props.stories.map((value, key) => {
		return !value.info.archived && value.info.qr && Object.keys(props.players[key]).length ? (
			<Row key={value.info.id}>
				<Col sm={12}>
					<ListStories
						setStorySelected={props.setStorySelected}
						players={props.players[key]}
						setPlayer={props.setPlayer}
						id={value.info.id}
						name={value.info.name}
						setRanking={props.setRanking}
						stories={props.stories}
					/>
				</Col>
			</Row>
		) : null;
	});
}
export default SideBar;
