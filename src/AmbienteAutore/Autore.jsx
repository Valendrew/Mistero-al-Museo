import React, { useState, useEffect } from "react";

import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";

import MissionsOverview from "./missions/MissionsOverview";
import MissionsTransitions from "./missions/MissionsTransitions";
import StoryOverview from "./stories/StoryOverview";

function StoryCard(props) {
	return (
		<Card>
			<Card.Header>{props.title}</Card.Header>
			<Card.Body>{props.description}</Card.Body>
		</Card>
	);
}
function AutoreHome() {
	const match = useRouteMatch();
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });
	const idStory = 1;

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
					<Nav.Link as={Link} to={`${match.url}/missions/create`}>
						Crea nuova storia
					</Nav.Link>
				</Nav>
			</Navbar>
			<Row>
				{stories.isLoaded ? (
					stories.items.map((value) => {
						return (
							<Col lg="4" key={value["name"]}>
								<StoryCard title={value["name"]} description={value["description"]} />
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
	const match = useRouteMatch();
	return (
		<Switch>
			<Route exact path="/autore">
				<AutoreHome match={match} />
			</Route>
			<Route path={`${match.path}/story`}>
				<StoryOverview />
			</Route>
			<Route path={`${match.path}/missions/create`}>
				<MissionsOverview />
			</Route>
			<Route path={`${match.path}/missions/transitions`}>
				<MissionsTransitions />
			</Route>
		</Switch>
	);
}

export default Autore;
