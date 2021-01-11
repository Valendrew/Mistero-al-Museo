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
						{value.status.interval > 1000 * 60 * 1.5 ? (
							<Spinner animation='grow' variant='info' />
						) : null}
						{value.help ? <Spinner animation='grow' variant='dark' /> : null}
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
}
function ListStories(props) {
	return (
		<Accordion>
			<Card>
				<Accordion.Toggle as={Card.Header} variant='light' eventKey={props.id}>
					{props.name}
				</Accordion.Toggle>

				<Accordion.Collapse eventKey={props.id}>
					<Card.Body>
						<ExportData players={props.players} storyID={props.id} />
						<ShowRanking setRanking={props.setRanking} />
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
						players={props.players[key]}
						setPlayer={props.setPlayer}
						id={value.info.id}
						name={value.info.name}
						setRanking={props.setRanking}
					/>
				</Col>
			</Row>
		) : null;
	});
}
export default SideBar;
