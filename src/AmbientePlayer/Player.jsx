import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import MainPage from "./MainPage";

function Player() {
	const { id } = useParams();
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/games/${id}`, {
				method: "GET",
				headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
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
		console.log("go");
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
