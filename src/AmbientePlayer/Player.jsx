import React, { useEffect, useState } from "react";
import { Switch, Route, useParams, useRouteMatch, useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import MainPage from "./MainPage";
import Game from "./Game/Game";

function Player() {
	const match = useRouteMatch("/player");
	return (
		<Switch>
			<Route path={`${match.path}/game`}>
				<Game />
			</Route>
			<Route path="/player/:id">
				<PlayerHome />
			</Route>
		</Switch>
	);
}

function PlayerHome() {
	const { id } = useParams();
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [story, setStory] = useState();
	const [status, setStatus] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${id}`, {
				method: "GET",
			});
			// Se la richiesta non è andata a buon fine
			if (!result.ok) setIsLoaded({ loaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({ ...data.story });
				setStatus({ ...data.status });
				setIsLoaded({ loaded: true });
			}
		};
		if (!isLoaded.loaded) fetchData();
	}, [id, isLoaded]);

	const startGame = () => {
		history.push("/player/game", {
			status: { ...status, status: story.missions[story.transitions[status.transition][0]].start },
			story: story,
			game: id,
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
							<h5>Benvenuto giocatore {status.name}</h5>
						</Row>
						<MainPage name={story.info.name} description={story.info.description} startGame={startGame} />
					</>
				)
			) : null}
		</Container>
	);
}

export default Player;
