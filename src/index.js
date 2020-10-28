import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import authDisplay from "./authDisplay";
import Login from "./Login";
import Autore from "./AmbienteAutore/Autore";
import Player from "./AmbientePlayer/Player";
import Valutatore from "./AmbienteValutatore/Valutatore";
function RouterSwitch() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route path="/autore" component={authDisplay(Autore)} />
			<Route path="/player/:id">
				<Player />
			</Route>
			<Route path="/valutatore" component={authDisplay(Valutatore)} />
			<Route render={() => <h1>404: Pagina non esistente</h1>} />
		</Switch>
	);
}

function Home() {
	return (
		<Container>

			<Row>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus commodo nisl maximus pretium. Donec sed
				urna convallis, auctor enim sed, euismod enim. Vivamus egestas auctor quam, ac lobortis arcu dapibus eu. Morbi
				mauris leo, luctus et mauris quis, bibendum cursus nisl. In hac habitasse platea dictumst. Nunc non elit erat.
				Sed venenatis purus ac vehicula tincidunt. Cras eu justo at purus auctor semper. Nam sem tellus, elementum et
				massa non, feugiat imperdie
			</Row>
		</Container>
	);
}

ReactDOM.render(
	<BrowserRouter>
		<Container>
			<Navbar>
				<Nav>
					<Nav.Link as={Link} to="/">
						Home
					</Nav.Link>
					<Nav.Link as={Link} to="/autore">
						Ambiente autore
					</Nav.Link>
					<Nav.Link as={Link} to="/valutatore">
						Valutatore
					</Nav.Link>
					<Nav.Link as={Link} to="/login">
						Login
					</Nav.Link>
				</Nav>
			</Navbar>
		</Container>
		<RouterSwitch />
	</BrowserRouter>,
	document.getElementById("root")
);

serviceWorker.unregister();
