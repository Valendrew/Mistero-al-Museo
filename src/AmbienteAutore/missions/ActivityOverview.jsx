import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Answers from "./Answers";
import ChildrenCard from "./ChildrenCard";

function ActivityOverview(props) {
	return (
		<ListGroup.Item className="mx-4">
			<Card>
				<Card.Header>
					Attività {props.activityNmb}
					{props.missions[props.activityNmb].filter((value) => Number.isInteger(parseInt(value)) && parseInt(value) !== parseInt(props.activityNmb))
						.length === 0 ? (
						<Button variant="danger" onClick={() => props.handleRemoveActivity(props.selPrefix)}>
							X
						</Button>
					) : null}
				</Card.Header>
				<Card.Body className="mx-2">
					<Answers {...props} />
					<ChildrenCard {...props} />
				</Card.Body>
			</Card>
		</ListGroup.Item>
	);
}

export default ActivityOverview;
