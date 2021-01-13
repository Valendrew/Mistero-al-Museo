import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Story from './Story';
import useInterval from '../../useInterval';
import { Button, Container, InputGroup, Row, Spinner } from 'react-bootstrap';
import EndGame from './EndGame'
function getCurrentMission(activity, missions, transitions) {
	return transitions.find(element => missions[element].hasOwnProperty(activity));
}

function Game() {
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [informations, setInformations] = useState();
	const [errorAnswer, setErrorAnswer] = useState();

	const [waitingOpen, setWaitingOpen] = useState(false);
	const [waitingHelp, setWaitingHelp] = useState();

	const [chat, setChat] = useState();
	const [givenAnswers, setGivenAnswers] = useState();
	const [newMessage, setNewMessage] = useState(false);

	useEffect(() => {
		if (!isLoaded.loaded) {
			setInformations({ ...informations, ...history.location.state });
			setErrorAnswer(null);
			setWaitingOpen(false);
			setIsLoaded({ loaded: true });
		}
	}, [history, isLoaded, informations]);

	const handleNextActivity = async answer => {
		if (answer.type === 'open') {
			/* Nel caso la risposta data sia sbagliata oppure debba
			essere valutata dal valutatore */

			await fetch(`/games/${informations.game}/players/answer`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer: answer, question: null })
			});

			setErrorAnswer(<Spinner animation='border' />);

			setWaitingOpen(true);
		} else if (answer.type === 'radio') {
			fetchInformationsNextActivity(answer.index, answer.score, answer);
		} else if (answer.type === 'storyline') {
			/* Nel caso di un'attività di sola narrazione verranno impostati
			a 0 sia l'indice della risposta che il punteggio da assegnare */

			fetchInformationsNextActivity(0, 0);
		}
	};

	const handleSendMessage = async message => {
		let data = chat;
		data ? data.push('p:' + message) : (data = ['p:' + message]);
		setChat(data);
		await fetch(`/games/${informations.game}/message`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat: data })
		});
	};

	const fetchInformationsNextActivity = async (answerIndex, score, answer = null) => {
		const { player, story, game } = informations;

		/* L'attività corrente e la transizione assegnata al player */
		const activity = player.status.activity;
		const transition = parseInt(player.info.transition);

		/* Ottengo la missione corrente e l'attività dopo
		in base alla risposta che è stata data  */
		const currentMission = getCurrentMission(activity, story.missions, story.transitions[transition]);
		let nextActivity = story.missions[currentMission][activity][answerIndex];

		if (nextActivity === activity) {
			setErrorAnswer(
				<InputGroup>
					<InputGroup.Prepend className='mr-4'>Risposta non corretta, riprovare</InputGroup.Prepend>
					<Button onClick={e => sendHelp(e, answer)}>Richiedi aiuto</Button>
				</InputGroup>
			);
		} else {
			if (nextActivity === 'new_mission') {
				const currentTransitions = story.transitions[transition];
				const nextMission = currentTransitions.indexOf(currentMission) + 1;

				/* Se l'indice della missione successiva nel vettore delle transizioni
				supera la lunghezza dello stesso, allora vuol dire che è finita la partita */
				if (nextMission === currentTransitions.length) nextActivity = 'end_game';
				else nextActivity = story.missions[currentTransitions[nextMission]].start;
			}

			const updatedStatus = {
				activity: nextActivity,
				dateActivity: new Date(),
				score: parseInt(player.status.score) + parseInt(score)
			};
			if (answer) {
				let data = givenAnswers;
				data
					? (data = {
							...data,
							[Object.keys(data).length]: {
								value: answer.ansVal,
								score: parseInt(score).toString(),
								question: story.activities[activity].questions[0].value,
								activity: activity.toString()
							}
					  })
					: (data = {
							0: {
								value: answer.ansVal,
								score: parseInt(score).toString(),
								question: story.activities[activity].questions[0].value,
								activity: activity.toString()
							}
					  });
				setGivenAnswers(data);
				await fetch(`/games/${game}/players/answers`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ givenAnswer: data })
				}).catch(e => console.log(e));
			}
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

	const sendHelp = async (e, latestAnswer) => {
		e.preventDefault();

		const result = await fetch(`/games/${informations.game}/players/help`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ help: latestAnswer })
		});
		if (result.ok) {
			setWaitingHelp(true);
		}
	};

	useInterval(
		async () => {
			const result = await fetch(`/games/${informations.game}/players/question`);
			if (result.ok) {
				result.json().then(data => {
					if (Object.keys(data).length) {
						if (data.correct) {
							const answer = { ansVal: data.answerPlayer };
							fetchInformationsNextActivity(0, data.value, answer);
						} else {
							setErrorAnswer(
								<InputGroup>
									<InputGroup.Prepend className='mr-4'>
										Risposta non corretta, riprovare. Motivo: {data.value}
									</InputGroup.Prepend>
									<Button onClick={e => sendHelp(e, data.answerPlayer)}>Richiedi aiuto</Button>
								</InputGroup>
							);
						}
						setWaitingOpen(false);
					}
				});
			}
		},
		waitingOpen ? 5000 : null
	);

	useInterval(
		async () => {
			const result = await fetch('/games/chatPlayer');
			if (result.ok) {
				result.json().then(data => {
					if (Object.keys(data).length) {
						setNewMessage(true);
						setChat(data.chat);
					}
				});
			}
		},
		isLoaded.loaded ? 5000 : null
	);

	useInterval(
		async () => {
			const result = await fetch(`/games/${informations.game}/players/help`);
			if (result.ok) {
				result.text().then(data => {
					if (data.trim()) {
						setErrorAnswer(
							<>
								{errorAnswer}
								<Row>Aiuto arrivato: {data}</Row>
							</>
						);

						setWaitingHelp(false);
					}
				});
			}
		},
		waitingHelp ? 5000 : null
	);

	useInterval(
		async () => {
			await fetch(`/games/${informations.game}/players/status`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					status: {
						...informations.player.status,
						interval: new Date() - Date.parse('1970-01-01T01:00:00') - new Date(informations.player.status.dateActivity)
					}
				})
			});
		},
		isLoaded.loaded ? 5000 : null
	);

	return (
		<Container fluid>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h6>Errore nel caricamento</h6>
				) : informations.player.status.activity === 'end_game' ? (
					<EndGame finalMessages={informations.story.finalMessages} playerScore={informations.player.status.score}/>
				) : (
					<Story
						player={informations.player}
						story={informations.story}
						errorAnswer={errorAnswer}
						waitingOpen={waitingOpen}
						handleNextActivity={handleNextActivity}
						handleSendMessage={handleSendMessage}
						chat={chat}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
					/>
				)
			) : (
				<h6>Caricamento in corso...</h6>
			)}
		</Container>
	);
}

export default Game;
