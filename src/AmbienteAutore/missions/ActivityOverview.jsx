import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Answers from "./Answers";
import ChildrenCard from "./ChildrenCard";

function ActivityOverview(props) {
	return (
		<ListGroup.Item>
			<Card>
				<Card.Header>Attività {props.activityNmb}
				<Button variant="danger" onClick={() => props.handleRemoveActivity(props.selPrefix)}>X</Button>
				</Card.Header>
				<Card.Body>
					<Answers {...props} />
					<ChildrenCard {...props}/>
				</Card.Body>
			</Card>
		</ListGroup.Item>
	);
}

export default ActivityOverview;
