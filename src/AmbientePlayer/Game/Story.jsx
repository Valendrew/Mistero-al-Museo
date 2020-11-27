import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import Storyline from './Storyline';
import Questions from './Questions';
import { useState } from 'react';

function Story({ player, story, errorAnswer, handleNextActivity }) {
	const [currentStory, setCurrentStory] = useState();
	const [inputsQuestion, setInputsQuestion] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false });

	useEffect(() => {
		const activity = player.status.activity;
		const questions = story.activities[activity].questions;

		setCurrentStory({
			activity: activity,
			storyline: story.activities[activity].storyline,
			questions: questions
		});

		if (questions.length) {
			if (questions[0].type === 'radio') {
				/* Gli input della risposta multipla saranno dei radio
                inizialmente nesusno sarà selezionato */
				setInputsQuestion(
					questions[0].answers.map(_ => ({
						value: false
					}))
				);
			} else if (questions[0].type === 'open') {
				/* L'input della domanda aperta sarà un text
                inizialmente vuoto */
				setInputsQuestion([{ value: '' }]);
			}
		} else setInputsQuestion();

		setIsLoaded({ loaded: true });
	}, [player, story]);

	const onChangeAnswer = (key, value) => {
		setInputsQuestion(inputsQuestion.map((_, index) => (index === key ? { value: value } : { value: false })));
	};

	const fetchAnswers = e => {
		e.preventDefault();

		let answerValue;
		if (currentStory.questions.length) {
			// Se è una domanda multipla (radio)
			if (currentStory.questions[0].type === 'radio') {
				answerValue = {
					type: 'radio',
					value: true,
					index: inputsQuestion.findIndex(element => element.value === true)
				};
			} else if (currentStory.questions[0].type === 'open') {
				answerValue = { type: 'open', value: inputsQuestion[0].value, index: 0 };
			}
		} else {
			answerValue = { type: 'storyline' };
		}
		handleNextActivity(answerValue);
	};

	return isLoaded.loaded ? (
		<>
			<h5>Al momento ti trovi nell'attività {currentStory.activity}</h5>
			<Storyline storyline={currentStory.storyline} />
			<hr />
			{currentStory.questions.length ? (
				<Questions
					question={currentStory.questions[0]}
					inputsQuestion={inputsQuestion}
					onChangeAnswer={onChangeAnswer}
				/>
			) : null}
			{errorAnswer || null}
			<Button name='nextActivity' variant='primary' onClick={e => fetchAnswers(e)}>
				Prosegui attività
			</Button>
		</>
	) : null;
}

export default Story;
