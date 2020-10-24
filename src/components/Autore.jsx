import React from "react";

import { Switch, Route, Link, useRouteMatch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import MissionsOverview from "./missions/MissionsOverview";
import MissionsTransitions from "./missions/MissionsTransitions";
import StoryOverview from "./stories/StoryOverview";

function AutoreHome() {
	const match = useRouteMatch();
	return (
		<Container>
			<Navbar>
				<Nav>
					<Nav.Link as={Link} to={`${match.url}/missions/create`}>
						Crea Missioni
					</Nav.Link>
					<Nav.Link as={Link} to={`${match.url}/missions/transitions`}>
						Transizioni missioni
					</Nav.Link>
					<Nav.Link as={Link} to={`${match.url}/story`}>
						Riassunto Storia
					</Nav.Link>
				</Nav>
			</Navbar>
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
