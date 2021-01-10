import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import Storyline from './Storyline';
import Questions from './Questions';
import Chat from './Chat';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';

function Story(props) {
	const [currentStory, setCurrentStory] = useState();
	const [inputsQuestion, setInputsQuestion] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false });
	const [showChat, setShowChat] = useState(false);

	useEffect(() => {
		const activity = props.player.status.activity;
		const questions = props.story.activities[activity].questions;

		setCurrentStory({
			activity: activity,
			storyline: props.story.activities[activity].storyline,
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
	}, [props.player, props.story]);

	const onChangeAnswer = (key, value) => {
		setInputsQuestion(inputsQuestion.map((_, index) => (index === key ? { value: value } : { value: false })));
	};
	

	const fetchAnswers = e => {
		e.preventDefault();

		let answerValue;

		/* Distinguo tra attività con una domanda oppure di sola narrazione */
		if (currentStory.questions.length) {
			if (currentStory.questions[0].type === 'radio') {
				// Se è una domanda multipla (radio)
				const index = inputsQuestion.findIndex(element => element.value === true);
				const partialScore = currentStory.questions[0].answers[index].score;
				const dateStart = props.player.status.dateActivity;
				answerValue = {
					type: 'radio',
					value: true,
					index: index,
					score: currentStory.questions[0].dinamicRating ? partialScore - ((Date.now()-dateStart)/1000) : partialScore,
					ansVal: currentStory.questions[0].answers[index].value
				};
			} else if (currentStory.questions[0].type === 'open') {
				answerValue = { type: 'open', value: inputsQuestion[0].value, index: 0 };
			}
		} else {
			answerValue = { type: 'storyline' };
		}
		props.handleNextActivity(answerValue);
	};

	return isLoaded.loaded ? (
		<>
			<Button variant="primary" onClick={() => {setShowChat(true); props.setNewMessage(false)}}>
				Chat
				{props.newMessage?(<Spinner animation='grow' variant='warning' />):(null)}
      		</Button>

			<Chat
				show={showChat}
				onHide={() => setShowChat(false)}
				/* chat={props.player.status.chat} */
				handleSendMessage={props.handleSendMessage}
				chat={props.chat}
			/>
			<h5>Al momento ti trovi nell'attività {currentStory.activity}</h5>
			<h6>Il punteggio attuale è {props.player.status.score}</h6>
			<Storyline storyline={currentStory.storyline} />
			<hr />
			{currentStory.questions.length ? (
				<Questions
					question={currentStory.questions[0]}
					inputsQuestion={inputsQuestion}
					onChangeAnswer={onChangeAnswer}
				/>
			) : null}
			{props.errorAnswer || null}
			{props.waitingOpen ? null : (
				<Button name='nextActivity' variant='primary' onClick={e => fetchAnswers(e)}>
					Prosegui attività
				</Button>
			)}
		</>
	) : null;
}

export default Story;
