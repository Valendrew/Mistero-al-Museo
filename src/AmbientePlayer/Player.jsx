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
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${id}`, {
				method: "GET",
			});
			// Se la richiesta non è andata a buon fine
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({
					isLoaded: true,
					items: data,
				});
			}
		};
		if (!story.isLoaded) fetchData();
	}, [id, story]);

	const startGame = async () => {
		history.push("/player/game", {
			player: story.items.player,
			story: story.items.story,
			activity: story.items.story.missions[0]["start"],
		});
	};

	return (
		<Container>
			{story.isLoaded ? (
				story.error ? (
					<h5>Errore nel caricamento, riprovare</h5>
				) : (
					<>
						<Row>
							<h5>Benvenuto giocatore {story.items.player}</h5>
						</Row>
						<MainPage
							name={story.items.story.info.name}
							description={story.items.story.info.description}
							startGame={startGame}
						/>
					</>
				)
			) : null}
		</Container>
	);
}

export default Player;
