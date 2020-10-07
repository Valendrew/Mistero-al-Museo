import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import OrganizeActivities from "./missions/OrganizeActivities";

import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";

function RouterSwitch() {
	return (
		<Router>
			<Link to="/missions">Crea missione</Link>
			<Switch>
				<Route path="/missions">
					<OrganizeActivities />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	);
}

function Home() {
	return <h1>PAGINA HOME</h1>;
}
ReactDOM.render(<RouterSwitch />, document.getElementById("root"));

serviceWorker.unregister();
