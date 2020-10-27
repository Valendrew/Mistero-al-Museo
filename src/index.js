import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Autore from "./AmbienteAutore/Autore";
import Player from "./AmbientePlayer/Player";
import Valutatore from "./AmbienteValutatore/Valutatore";

function RouterSwitch() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route path="/autore">
				<Autore />
			</Route>
			<Route path="/player/:id">
				<Player />
			</Route>
			<Route path="/valutatore">
				<Valutatore />
			</Route>
			<Route render={() => <h1>404: Pagina non esistente</h1>} />
		</Switch>
	);
}

function Home() {
	return (
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
				</Nav>
			</Navbar>
			<Row>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus commodo nisl maximus pretium. Donec sed
				urna convallis, auctor enim sed, euismod enim. Vivamus egestas auctor quam, ac lobortis arcu dapibus eu. Morbi
				mauris leo, luctus et mauris quis, bibendum cursus nisl. In hac habitasse platea dictumst. Nunc non elit erat.
				Sed venenatis purus ac vehicula tincidunt. Cras eu justo at purus auctor semper. Nam sem tellus, elementum et
				massa non, feugiat imperdiet eros. Nulla nec mollis neque. Donec vel auctor quam. Maecenas volutpat lobortis
				ipsum vel pretium. Donec hendrerit convallis ex sit amet tincidunt. Donec ut condimentum risus. Praesent vel ex
				orci. Nulla non auctor dui, id eleifend neque. Morbi vitae tortor diam. Phasellus sed purus tincidunt, aliquam
				velit eu, finibus mi. In at urna ipsum. Nunc vestibulum luctus lectus eu hendrerit. Phasellus nibh leo,
				consequat at tincidunt hendrerit, volutpat non erat. Maecenas eu nulla vel libero convallis pulvinar. Aliquam
				gravida ultrices euismod. Fusce congue a mauris ac interdum. Vivamus interdum vehicula euismod. Integer lobortis
				massa quis neque aliquet tristique. Phasellus laoreet est vel convallis eleifend. Orci varius natoque penatibus
				et magnis dis parturient montes, nascetur ridiculus mus. Aenean sit amet enim quis nulla viverra iaculis vitae
				ac erat. Pellentesque ut eleifend nulla. Integer mollis massa in urna tristique consequat. Fusce non purus a
				justo tincidunt lacinia. Donec in mi augue. Suspendisse posuere sodales eros, sed placerat magna. Sed blandit
				tempor orci, nec dictum mi euismod id.
			</Row>
		</Container>
	);
}

ReactDOM.render(
	<BrowserRouter>
		<RouterSwitch />
	</BrowserRouter>,
	document.getElementById("root")
);

serviceWorker.unregister();
