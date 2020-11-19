import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

function ActivityListItem({ value }) {
	const [mediaURL, setMediaURL] = useState(undefined);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (!mediaURL) {
			if (value[0] === "img" || value[0] === "video") {
				fetch(`/files/${value[1]}.${value[2]}`)
					.then((result) => result.blob())
					.then((data) => {
						var objectURL = URL.createObjectURL(data);
						setMediaURL(objectURL);
						setIsLoaded(true);
					})
					.catch((e) => console.log(e));
			} else setIsLoaded(true);
		}
	}, [mediaURL, value]);
	
	return (
		<ListGroup.Item>
			{isLoaded ? (
				<>
					{value[0]} :
					{value[0] === "img" ? (
						<Image src={mediaURL} thumbnail fluid />
					) : value[0] === "video" ? (
						<video alt="" width="320" height="240" controls>
							<source src={mediaURL}></source>
						</video>
					) : (
						value[1]
					)}
				</>
			) : (
				"Loading..."
			)}
		</ListGroup.Item>
	);
}
function ActivityList(props) {
	return (
		<ListGroup variant="flush">
			{props.activity.storyline.map((value, key) => (
				<ActivityListItem key={key} value={value} />
			))}
		</ListGroup>
	);
}

function ActivityCard(props) {
	return (
		<Col className="my-2">
			<Card style={{ height: "50vh" }}>
				<Card.Header>{props.activity.name}</Card.Header>
				<Card.Body style={{ heigth: "50%", "overflowY": "auto" }}>
					<Card.Title>Elementi narrazione</Card.Title>
					<ActivityList {...props} />
				</Card.Body>
				<Card.Footer>
					<Button variant="danger" onClick={(e) => props.onEditActivity(e, props.id)}>
						Modifica
					</Button>
				</Card.Footer>
			</Card>
		</Col>
	);
}

export default ActivityCard;
