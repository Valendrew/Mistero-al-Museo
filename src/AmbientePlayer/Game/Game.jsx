import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Story from './Story';
import useInterval from './useInterval';
import { Spinner } from 'react-bootstrap';

function getCurrentMission(activity, missions, transitions) {
	return transitions.find(element => missions[element].hasOwnProperty(activity));
}

function Game() {
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [informations, setInformations] = useState();
	const [errorAnswer, setErrorAnswer] = useState();
	const [waitingOpen, setWaitingOpen] = useState(false);

	useEffect(() => {
		if (!isLoaded.loaded) {
			setInformations({ ...informations, ...history.location.state });
			setErrorAnswer();
			setIsLoaded({ loaded: true });
		}
	}, [history, isLoaded]);

	const handleNextActivity = async answer => {
		const { player, story, game } = informations;
		const activity = player.status.activity;
		const transition = parseInt(player.info.transition);

		/* Ottengo la missione corrente e successivamente
		l'attività dopo in base alla risposta che è stata data  */
		const currentMission = getCurrentMission(activity, story.missions, story.transitions[transition]);
		let nextActivity = story.missions[currentMission][activity][answer.index];

		if (answer.type === 'open') {
			/* Nel caso la risposta data sia sbagliata oppure debba
			essere valutata dal valutatore */
			await fetch(`/games/${game}/players/answer`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer: answer, question: {} })
			});
			setErrorAnswer(<Spinner animation='border' />);
			setWaitingOpen(true);
		} else if (nextActivity === activity) {
			//
		} else {
			/* if (nextActivity === 'new_mission') {
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

			setIsLoaded({ loaded: false, error: null }); */
		}
	};

	useInterval(
		async () => {
			const result = await fetch(`/games/${informations.game}/players/question`);
			if (result.ok) {
				result.json().then(data => {
					console.log(data);
					if (Object.keys(data).length) {
						if (!data.correct) {
							setErrorAnswer(<p>Non corretta (da server)</p>);
						}
						setWaitingOpen(false);
					}
				});
			}
		},
		waitingOpen ? 2000 : null
	);
	return (
		<Container>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h6>Errore nel caricamento</h6>
				) : (
					<Story
						player={informations.player}
						story={informations.story}
						errorAnswer={errorAnswer}
						handleNextActivity={handleNextActivity}
					/>
				)
			) : (
				<h6>Caricamento in corso...</h6>
			)}
		</Container>
	);
}

export default Game;
