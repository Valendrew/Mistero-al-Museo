import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { ButtonGroup, Spinner } from 'react-bootstrap';

import ExportData from './ExportData';
import ShowRanking from './ShowRanking';

function PlayerList(props) {
	return (
		<ListGroup variant='flush'>
			{Object.entries(props.players).map(([key, value]) => {
				return (
					<ListGroup.Item
						key={key}
						action
						onClick={() => {
							props.setPlayer(key, value, props.id);
							props.setRanking(false);
						}}>
						{value.name}
						{value.answer ? <Spinner animation='grow' variant='warning' /> : null}
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
}
function ListStories(props) {
	return (
		<Accordion>
			{console.log('PLAYERS: ')}
			{console.log(props.players)}
			<Card style={{ height: '100vh', overflowY: 'scroll' }}>
				<Accordion.Toggle as={Card.Header} variant='light' eventKey={props.id}>
					{props.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.id}>
					<Row className='m-2'>
						<ButtonGroup>
							<ExportData players={props.players} storyID={props.id} />
							<ShowRanking setRanking={props.setRanking} />
						</ButtonGroup>
					</Row>
				</Accordion.Collapse>

				<Accordion.Collapse eventKey={props.id}>
					<Card.Body>
						<PlayerList {...props} />
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

function SideBar({ stories, players, setPlayer, setRanking }) {
	return stories.map((value, key) => {
		return (
			<Row key={value.info.id}>
				<Col sm={12}>
					<ListStories
						players={players[key]}
						setPlayer={setPlayer}
						id={value.info.id}
						name={value.info.name}
						setRanking={setRanking}
					/>
				</Col>
			</Row>
		);
	});
}
export default SideBar;
