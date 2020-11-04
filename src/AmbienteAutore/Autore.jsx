import React, { useState, useEffect } from "react";

import { Switch, Route, Link, useRouteMatch, useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import MissionsOverview from "./missions/MissionsOverview";
import MissionsTransitions from "./missions/MissionsTransitions";
import StoryOverview from "./stories/StoryOverview";
import CreaStoria from "./activities/creaStoria";

function StoryCard(props) {
	return (
		<Card>
			<Card.Header>{props.title}</Card.Header>
			<Card.Body>
				<Card.Text>{props.description}</Card.Text>
				<Button variant="primary" onClick={() => props.onEditStory(props.id)}>
					Modifica storia
				</Button>
			</Card.Body>
		</Card>
	);
}
function AutoreHome(props) {
	const match = useRouteMatch("/autore");
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		fetch(`/story`, {
			method: "GET",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then(
				(result) => {
					setStories({
						isLoaded: true,
						items: result,
					});
				},
				(error) => {
					setStories({
						isLoaded: true,
						error,
					});
				}
			);
	}, []);

	return (
		<Container>
			<Navbar>
				<Nav>
					<Nav.Link as={Link} to="/">
						Home
					</Nav.Link>
					<Nav.Link as={Link} to={`${match.url}/story/activity`}>
						Crea nuova storia
					</Nav.Link>
				</Nav>
			</Navbar>
			<Row>
				{stories.isLoaded ? (
					stories.items.map((value) => {
						return (
							<Col lg="4" key={value.info.name}>
								<StoryCard id={value.info.id} title={value.info.name} description={value.info.description} {...props} />
							</Col>
						);
					})
				) : (
					<h5>Loading</h5>
				)}
			</Row>
		</Container>
	);
}
function Autore() {
	const match = useRouteMatch("/autore");
	let history = useHistory();

	const onEditStory = (id) => {
		history.push(`${match.path}/story`, { idStory: id });
	};

	return (
		<Switch>
			<Route exact path="/autore">
				<AutoreHome onEditStory={onEditStory} />
			</Route>
			<Route exact path={`${match.path}/story`}>
				<StoryOverview />
			</Route>
			<Route path={`${match.path}/story/missions`}>
				<MissionsOverview />
			</Route>
			<Route path={`${match.path}/story/transitions`}>
				<MissionsTransitions />
			</Route>
			<Route path={`${match.path}/story/activity`}>
				<CreaStoria />
			</Route>
		</Switch>
	);
}

export default Autore;
