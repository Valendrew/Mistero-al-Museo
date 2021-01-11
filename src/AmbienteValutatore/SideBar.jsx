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
						<ShowRanking
							setRanking={props.setRanking}
							setStorySelected={props.setStorySelected}
							stories={props.stories}
							storyID={props.id}
						/>
						<PlayerList {...props} />
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

function SideBar({ stories, players, setPlayer, setRanking, setStorySelected }) {
	return stories.map((value, key) => {
		return !value.info.archived && value.info.qr && Object.keys(players[key]).length ? (
			<Row key={value.info.id}>
				<Col sm={12}>
					<ListStories
						setStorySelected={setStorySelected}
						players={players[key]}
						setPlayer={setPlayer}
						id={value.info.id}
						name={value.info.name}
						setRanking={setRanking}
						stories={stories}
					/>
				</Col>
			</Row>
		) : null;
	});
}
export default SideBar;
