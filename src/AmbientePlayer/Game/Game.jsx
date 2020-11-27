import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Story from './Story';

function getCurrentMission(activity, missions, transitions) {
	return transitions.find(element => missions[element].hasOwnProperty(activity));
}

function Game() {
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [informations, setInformations] = useState();
	//const [errorAnswer, setErrorAnswer] = useState();

	useEffect(() => {
		if (!isLoaded.loaded) {
			setInformations({ ...informations, ...history.location.state });
			//setErrorAnswer();
			setIsLoaded({ loaded: true });
		}
	}, [history, isLoaded]);

	const handleNextActivity = async answer => {
		const { player, story, game } = informations;
		const activity = player.status.activity;
		const transition = parseInt(player.info.transition);

		// Ottenuta la missione corrente
		const currentMission = getCurrentMission(activity, story.missions, story.transitions[transition]);

		let nextActivity = story.missions[currentMission][activity][answer.index];

		if (nextActivity === activity || answer.type === 'open') {
			/* Nel caso la risposta data sia sbagliata oppure debba
			essere valutata dal valutatore */
			await fetch(`/games/${game}/players/answer`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer: answer })
			});
		} else {
			if (nextActivity === 'new_mission') {
				const currentTransitions = story.transitions[transition];
				const nextMission = currentTransitions.indexOf(currentMission) + 1;

				if (nextMission === currentTransitions.length) nextActivity = 'end_game';
				else nextActivity = story.missions[currentTransitions[nextMission]].start;
			}

			const updatedStatus = { activity: nextActivity, dateActivity: new Date() };
			await fetch(`/games/${game}/players/status`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: updatedStatus })
			}).catch(e => console.log(e));

			history.push('/player/game', {
				player: { ...informations.player, status: updatedStatus }
			});

			setIsLoaded({ loaded: false, error: null });
		}
	};

	return (
		<Container>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h6>Errore nel caricamento</h6>
				) : (
					<Story player={informations.player} story={informations.story} handleNextActivity={handleNextActivity} />
				)
			) : (
				<h6>Caricamento in corso...</h6>
			)}
		</Container>
	);
}

export default Game;
