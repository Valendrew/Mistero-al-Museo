import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import authDisplay from './authDisplay';
import Login from './Login';
import Autore from './AmbienteAutore/Autore';
import Player from './AmbientePlayer/Player';
import Valutatore from './AmbienteValutatore/Valutatore';
function RouterSwitch() {
	return (
		<Switch>
			<Route exact path='/'>
				<Home />
			</Route>
			<Route exact path='/login'>
				<Login />
			</Route>
			<Route path='/autore' component={authDisplay(Autore)} />
			<Route path='/player/:id'>
				<Player />
			</Route>
			<Route path='/valutatore' component={authDisplay(Valutatore)} />
			<Route render={() => <h1>404: Pagina non esistente</h1>} />
		</Switch>
	);
}

function Home() {
	return (
		<Container>
			<Navbar>
				<Nav>
					<Nav.Link as={Link} to='/'>
						Home
					</Nav.Link>
					<Nav.Link as={Link} to='/autore'>
						Ambiente autore
					</Nav.Link>
					<Nav.Link as={Link} to='/valutatore'>
						Valutatore
					</Nav.Link>
					<Nav.Link as={Link} to='/login'>
						Login
					</Nav.Link>
				</Nav>
			</Navbar>
			<Row>
				Progetto del corso di Tecnologie Web dell'anno accademico 2019/2020 realizzato da Procino Edoardo, Valente
				Andrea, Venturi Elia, studenti di Scienze dell'Informatica dell'Università di Bologna.
			</Row>
		</Container>
	);
}

ReactDOM.render(
	<BrowserRouter>
		<RouterSwitch />
	</BrowserRouter>,
	document.getElementById('root')
);

serviceWorker.unregister();
