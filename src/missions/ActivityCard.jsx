import React from "react";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function ActivityList(props) {
	return (
		<ListGroup variant="flush">
			{props.storyline.map((value, key) => (
				<ListGroup.Item key={key}>
					{value[0]}: {value[1]}
				</ListGroup.Item>
			))}
		</ListGroup>
	);
}

function ActivityCard(props) {
	return (
		<Col>
			<Card>
				<Card.Header>Attività {(props.id + 1).toString()}</Card.Header>
				<Card.Body>
					<Card.Title>Elementi narrazione</Card.Title>
					<ActivityList {...props} />
				</Card.Body>
			</Card>
		</Col>
	);
}

export default ActivityCard;
