import React, { useEffect, useState } from 'react';
import { Switch, Route, useParams, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import MainPage from './MainPage';
import Game from './Game/Game';

import styleGeneric from './Style/style.module.css';
import styleEgypt from './Style/styleEgypt.module.css';
import stylePrehistory from './Style/stylePrehistory.module.css';
import { Col } from 'react-bootstrap';

const themeConverter = { egypt: styleEgypt, generico: styleGeneric, prehistory: stylePrehistory };

function Player() {
	const [style, setStyle] = useState();

	return (
		<Switch>
			<Route path='/player/game'>
				<Game style={style} />
			</Route>
			<Route path='/player/:id'>
				<PlayerHome style={style} setStyle={setStyle} />
			</Route>
		</Switch>
	);
}

function PlayerHome(props) {
	const { id } = useParams(); // id per identificare la storia
	const history = useHistory();
	const [story, setStory] = useState();
	const [player, setPlayer] = useState();
	const [fetchIsLoaded, setFetchIsLoaded] = useState({ loaded: false, error: null });
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${id}`, {
				method: 'POST'
			});
			// Se la richiesta non è andata a buon fine
			if (!result.ok) setFetchIsLoaded({ loaded: true, error: result.statusText });
			else {
				const data = await result.json();

				setFetchIsLoaded({ loaded: true });

				props.setStyle(themeConverter[data.story.info.theme]);
				setStory({ ...data.story });
				setPlayer({ ...data.player });
				setIsLoaded({ loaded: true });
			}
		};
		if (!fetchIsLoaded.loaded) fetchData();
	}, [id, fetchIsLoaded, props]);

	const startGame = async () => {
		/* Aggiorno lo stato sia nel server e sia localmente per
		indicare l'attività successiva in cui si troverà il player  */
		const newStatus = {
			status: {
				activity: story.missions[story.transitions[player.info.transition][0]].start,
				dateActivity: new Date(),
				score: 0
			}
		};

		await fetch(`/games/${id}/players/status`, {
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

	return isLoaded.loaded ? (
		isLoaded.error ? (
			<h1>Errore nel caricamento, riprovare</h1>
		) : (
			<Container fluid className={`p-4 ${props.style.sfondo}`}>
				<header>
					<Row>
						<Col className={props.style.container}>
							<h1>{`Benvenuto ${player.name} nella partita`}</h1>
						</Col>
					</Row>
				</header>

				<MainPage
					name={story.info.name}
					description={story.info.description}
					style={props.style}
					startGame={startGame}
				/>
			</Container>
		)
	) : null;
}

export default Player;
