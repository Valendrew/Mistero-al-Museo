import React, { useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function MainPage(props) {
	return (
		<Card>
			<Card.Header>{props.name}</Card.Header>
			<Card.Body>
				{props.description}
			</Card.Body>
			<Card.Footer>
				<Button onClick={props.startGame}>Chatta con valutatore</Button>
			</Card.Footer>
		</Card>
	);
}

export default MainPage;
