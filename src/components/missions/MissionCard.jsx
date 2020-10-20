import React from "react";

import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import ActivityOverview from "./ActivityOverview";

function MissionCard(props) {
	const selPrefix = `m${props.missionNmb}_a${props.missions['start']}`;
	return (
		<Row>
			<Card>
				<Card.Header>Missione {props.missionNmb}</Card.Header>
				<Card.Body>
					<ListGroup>
						<ActivityOverview {...props}  selPrefix={selPrefix} activityNmb={props.missions['start']} />
					</ListGroup>
				</Card.Body>
			</Card>
		</Row>
	);
}

export default MissionCard;
