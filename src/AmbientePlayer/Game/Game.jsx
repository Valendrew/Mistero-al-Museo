import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Storyline from "./Storyline";
import Questions from "./Questions";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function getCurrentMission(activity, missions, transitions) {
	return transitions.find((element) => missions[element].hasOwnProperty(activity));
}
function Game() {
	const history = useHistory();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [story, setStory] = useState();
	const [activity, setActivity] = useState();
	const [transition, setTransition] = useState();
	const [game, setGame] = useState();
	const [answersSelected, setAnswersSelected] = useState();

	useEffect(() => {
		if (!isLoaded.loaded) {
			if (history.location.state.status.status !== "end_game") {
				const currentStory = history.location.state.story;
				const currentActivity = history.location.state.status.status;
				setStory(currentStory);
				setActivity(currentActivity);
				setTransition(history.location.state.status.transition);
				setGame(history.location.state.game);

				if (currentStory.activities[currentActivity].questions.length) {
					const answers = currentStory.activities[currentActivity].questions[0].answers;
					if (answers) {
						const answersObject = answers.map((value) => {
							return {
								value: false,
							};
						});
						setAnswersSelected(answersObject);
					} else {
						setAnswersSelected([{ value: false }]);
					}
				} else setAnswersSelected();
				setIsLoaded({ loaded: true });
			} else {
				setIsLoaded({ loaded: true, error: "end_game" });
			}
		}
	}, [history, isLoaded]);

	const handleNextActivity = () => {
		let answerTransition;
		const currentMission = getCurrentMission(activity, story.missions, story.transitions[parseInt(transition)]);
		if (story.activities[activity].questions.length) {
			if (story.activities[activity].questions[0].answers) {
				answersSelected.forEach((element, index) => {
					if (element.value === true) {
						answerTransition = index;
					}
				});
			} else answerTransition = 0; // da cambiare
		} else {
			// caso solo narrazione
			answerTransition = 0;
		}

		let nextActivity = story.missions[currentMission][activity][answerTransition];

		if (nextActivity === "new_mission") {
			const currentTransitions = story.transitions[transition];
			const nextMission = currentTransitions.indexOf(currentMission) + 1;
			if (nextMission === currentTransitions.length) nextActivity = "end_game";
			else nextActivity = story.missions[currentTransitions[nextMission]].start;
		}

		history.replace("/player/game", {
			status: { ...history.location.state.status, status: nextActivity },
			story: story,
			game: game,
		});
		setIsLoaded({ loaded: false, error: null });
	};

	const onChangeAnswer = (key, value) => {
		let answersTmp = [...answersSelected];
		answersTmp[key] = { ...answersTmp[key], value: value };
		setAnswersSelected(answersTmp);
	};
	return (
		<Container>
			{isLoaded.loaded ? (
				isLoaded.error ? (
					<h6>HAI FINITO IL GIOCO</h6>
				) : (
					<>
						<h5>
							Al momento ti trovi nell'attività {activity} nella missione{" "}
							{getCurrentMission(activity, story.missions, story.transitions[parseInt(transition)])}
						</h5>

						<Storyline storyline={story.activities[activity].storyline} />
						<hr />
						{story.activities[activity].questions.length ? (
							<Questions questions={story.activities[activity].questions} answersSelected={answersSelected} onChangeAnswer={onChangeAnswer} />
						) : null}
						<Button name="nextActivity" variant="primary" onClick={handleNextActivity}>
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
