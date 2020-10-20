import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import MissionsOverview from "./missions/MissionsOverview";
import MissionsTransitions from "./missions/MissionsTransitions";
import StoryOverview from "./stories/StoryOverview";

function RouterSwitch() {
	return (
		<Router>
			<Navbar>
				<Nav>
					<Nav.Item>
						<Link to="/">Home</Link>
					</Nav.Item>
					<Nav.Item>
						<Link to="/missions/create">Crea Missione</Link>
					</Nav.Item>
					<Nav.Item>
						<Link to="/missions/transitions">Transizione missione</Link>
					</Nav.Item>
					<Nav.Item>
						<Link to="/story/overview">Riassunto storia</Link>
					</Nav.Item>
				</Nav>
			</Navbar>
			<Switch>
				<Route exact path="/story/overview" component={StoryOverview} />
				<Route exact path="/missions/create" component={MissionsOverview} />
				<Route exact path="/missions/transitions" component={MissionsTransitions} />
				<Route exact path="/" component={Home} />
				<Route render={() => <h1>404: Pagina non esistente</h1>} />
			</Switch>
		</Router>
	);
}

function Home() {
	return <h1>PAGINA HOME</h1>;
}

ReactDOM.render(<RouterSwitch />, document.getElementById("root"));

serviceWorker.unregister();
