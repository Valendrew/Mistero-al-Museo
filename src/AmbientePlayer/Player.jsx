import React, { useEffect, useState } from 'react';
import { Switch, Route, useParams, useRouteMatch, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import MainPage from './MainPage';
import Game from './Game/Game';

function Player() {
	const match = useRouteMatch('/player');
	return (
		<Switch>
			<Route path={`${match.path}/game`}>
				<Game />
			</Route>
			<Route path='/player/:id'>
				<PlayerHome />
			</Route>
		</Switch>
	);
}

function PlayerHome() {
	const { id } = useParams();
	const history = useHistory();

	const [story, setStory] = useState();
	const [player, setPlayer] = useState();

	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${id}`, {
				method: 'POST'
			});
			// Se la richiesta non è andata a buon fine
			if (!result.ok) setIsLoaded({ loaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({ ...data.story });
				setPlayer({ ...data.player });
				setIsLoaded({ loaded: true });
			}
		};
		if (!isLoaded.loaded) fetchData();
	}, [id, isLoaded]);

	const startGame = async () => {
		/* Aggiorno lo stato sia nel server e sia localmente per
		indicare l'attività successiva in cui si troverà il player  */
		const newStatus = {
			status: {
				activity: story.missions[story.transitions[player.info.transition][0]].start,
				dateActivity: new Date()
			}
		};

		await fetch(`/games/${id}/players`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newStatus)
		});

		history.replace('/player/game', {
			player: { ...player, ...newStatus },
			story: story,
			game: id
		});
	};

	return (
		<Container>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h5>Errore nel caricamento, riprovare</h5>
				) : (
					<>
						<Row>
							<h5>Benvenuto giocatore {player.name}</h5>
						</Row>
						<MainPage name={story.info.name} description={story.info.description} startGame={startGame} />
					</>
				)
			) : null}
		</Container>
	);
}

export default Player;
