import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";

import OrganizeActivities from "./missions/OrganizeActivities";
import OrganizeMissions from "./missions/OrganizeMissions";

function RouterSwitch() {
	return (
		<Router>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/missions/create">Crea Missione</Link>
					</li>
					<li>
						<Link to="/missions/transition">Transizione missione</Link>
					</li>
				</ul>
			</nav>
			<Switch>
				<Route exact path="/missions/transition" component={OrganizeMissions} />
				<Route exact path="/missions/create" component={OrganizeActivities} />
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
