import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

function PlayerList(props) {
	return (
		<ListGroup variant='flush'>
			{Object.entries(props.players).map(([key, value]) => {
				return (
					<ListGroup.Item key={key} action onClick={() => props.setPlayer(key, value, props.id)}>
						<h6>{value.name}</h6>
					</ListGroup.Item>
				);
			})}
		</ListGroup>
	);
}
function ListStories(props) {
	return (
		<Accordion>
			<Card style={{ height: '100vh', overflowY: 'scroll' }}>
				<Accordion.Toggle as={Card.Header} variant='light' eventKey={props.id}>
					{props.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.id}>
					<Card.Body>
						<PlayerList {...props} />
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

function SideBar({ stories, players, setPlayer }) {
	return (
		<Row>
			<Col sm={12}>
				{stories.map((value, key) => {
					return (
						<ListStories
							key={key}
							players={players[key]}
							id={value.info.id}
							name={value.info.name}
							setPlayer={setPlayer}
						/>
					);
				})}
			</Col>
		</Row>
	);
}
export default SideBar;
