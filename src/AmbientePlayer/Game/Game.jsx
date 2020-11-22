import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Storyline from './Storyline';
import Questions from './Questions';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function getCurrentMission(activity, missions, transitions) {
	return transitions.find(element => missions[element].hasOwnProperty(activity));
}

function Game() {
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [story, setStory] = useState();
	const [activity, setActivity] = useState();
	const [transition, setTransition] = useState();
	const [game, setGame] = useState();
	const [answersSelected, setAnswersSelected] = useState();
	const [errorAnswer, setErrorAnswer] = useState();

	useEffect(() => {
		if (!isLoaded.loaded) {
			if (history.location.state.status.state !== 'end_game') {
				let currentStory = history.location.state.story;
				const gameID = history.location.state.game;

				if (currentStory) setStory(currentStory);
				else currentStory = story;

				if (gameID) setGame(gameID);

				const currentActivity = history.location.state.status.state;
				setActivity(currentActivity);

				setTransition(history.location.state.status.transition);
				setErrorAnswer();
				const questions = currentStory.activities[currentActivity].questions;
				if (questions.length) {
					if (questions[0].type === 'radio') {
						setAnswersSelected(
							questions[0].answers.map(value => ({
								value: false
							}))
						);
					} else if (questions[0].type === 'open') setAnswersSelected([{ value: '' }]);
				} else setAnswersSelected();

				setIsLoaded({ loaded: true });
			} else {
				setIsLoaded({ loaded: true, error: 'end_game' });
			}
		}
	}, [history, isLoaded, story]);

	const handleNextActivity = async () => {
		// Ottenuta la missione corrente
		const currentMission = getCurrentMission(activity, story.missions, story.transitions[parseInt(transition)]);

		let answerTransition = -1;

		if (story.activities[activity].questions.length) {
			// Se è una domanda multipla (radio)
			if (story.activities[activity].questions[0].type === 'radio') {
				answersSelected.forEach((element, index) => {
					if (element.value === true) {
						answerTransition = index;
					}
				});
			} else if (story.activities[activity].questions[0].type === 'open') {
				if (answersSelected[0].value.trim()){
					const result = await fetch('/games/answer',{
						method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({val: answersSelected[0].value, storyId:story.info.id})
					});
					//answerTransition = 0;
				} 
			}
		} else {
			// caso solo narrazione
			answerTransition = 0;
		}

		if (answerTransition === -1) {
			setErrorAnswer(<p className='text-danger'>Inserisci una risposta</p>);
		} else {
			let nextActivity = story.missions[currentMission][activity][answerTransition];

			if (nextActivity === activity) {
				setErrorAnswer(<p className='text-danger'>Risposta errata</p>);
			} else {
				if (nextActivity === 'new_mission') {
					const currentTransitions = story.transitions[transition];
					const nextMission = currentTransitions.indexOf(currentMission) + 1;

					if (nextMission === currentTransitions.length) nextActivity = 'end_game';
					else nextActivity = story.missions[currentTransitions[nextMission]].start;
				}

				const stateToSend = { state: nextActivity };
				await fetch(`/games/${game}/players`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(stateToSend)
				});

				history.push('/player/game', {
					status: { ...history.location.state.status, state: nextActivity }
				});

				setIsLoaded({ loaded: false, error: null });
			}
		}
	};

	const onChangeAnswer = (key, value) => {
		let answersTmp = [...answersSelected];

		//answersTmp[key] = { ...answersTmp[key], value: value };
		setAnswersSelected(answersTmp.map((val, index) => (index === key ? { value: value } : { value: false })));
	};

	return (
		<Container>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h6>HAI FINITO IL GIOCO</h6>
				) : (
					<>
						<h5>
							Al momento ti trovi nell'attività {activity} nella missione{' '}
							{getCurrentMission(activity, story.missions, story.transitions[parseInt(transition)])}
						</h5>

						<Storyline storyline={story.activities[activity].storyline} />
						<hr />
						{story.activities[activity].questions.length ? (
							<Questions
								questions={story.activities[activity].questions}
								answersSelected={answersSelected}
								onChangeAnswer={onChangeAnswer}
							/>
						) : null}
						{errorAnswer}
						<Button name='nextActivity' variant='primary' onClick={handleNextActivity}>
							Prosegui attività
						</Button>
					</>
				)
			) : (
				<h6>Caricamento in corso...</h6>
			)}
		</Container>
	);
}

export default Game;
