import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";

function PlayerList(props) {
	const idStory = props.id;
	const [players, setPlayers] = useState({ error: null, isLoaded: false, items: {} });
	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${idStory}/players`);
			if (!result.ok) setPlayers({ isLoaded: true, error: result.statusText });
			else {
				result.json().then((data) => setPlayers({ isLoaded: true, items: data }));
			}
		};
		if (!players.isLoaded) fetchData();
	}, [idStory, players]);
	return (
		<ListGroup variant="flush">
			{Object.entries(players.items).map(([key, value]) => {
				return (
					<ListGroup.Item key={key} action onClick={() => props.setPlayer(key, value)}>
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
			<Card>
				<Accordion.Toggle as={Card.Header} variant="light" eventKey={props.id}>
					{props.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.id}>
					<Card.Body>
						<PlayerList id={props.id} setPlayer={props.setPlayer} />
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
}

function SideBar(props) {
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/stories`);
			if (!result.ok)
				setStories({
					isLoaded: true,
					error: result.statusText,
				});
			else {
				result.json().then((data) =>
					setStories({
						isLoaded: true,
						items: data,
					})
				);
			}
		};
		if (!stories.isLoaded) fetchData();
	}, [stories]);
	return (
		<Row>
			{stories.isLoaded ? (
				stories.error ? (
					<h6>Errore caricamento</h6>
				) : (
					<Col sm={12}>
						{stories.items.map((value, key) => {
							return <ListStories key={key} {...props} id={value.info.id} name={value.info.name} />;
						})}
					</Col>
				)
			) : (
				<h6>In caricamento...</h6>
			)}
		</Row>
	);
}
export default SideBar;
