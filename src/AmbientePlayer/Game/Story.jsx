import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import Storyline from './Storyline';
import Questions from './Questions';
import Chat from './Chat';
import { useState } from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

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
		setInputsQuestion(
			inputsQuestion.map((_, index) => (index === key ? { value: value } : { value: false }))
		);
	};

	const fetchAnswers = e => {
		e.preventDefault();

		let answerValue;

		/* Distinguo tra attività con una domanda oppure di sola narrazione */
		if (currentStory.questions.length) {
			if (currentStory.questions[0].type === 'radio') {
				// Se è una domanda multipla (radio)
				const index = inputsQuestion.findIndex(element => element.value === true);

				if (index === -1) {
					props.setErrorAnswer(
						<span className={props.style.paragrafoerrore}>
							Seleziona almeno un elemento come risposta
						</span>
					);
				} else {
					const partialScore = currentStory.questions[0].answers[index].score;
					const dateStart = props.player.status.dateActivity;
					answerValue = {
						type: 'radio',
						value: true,
						index: index,
						score: currentStory.questions[0].dinamicRating
							? partialScore - (Date.now() - dateStart) / 1000
							: partialScore,
						ansVal: currentStory.questions[0].answers[index].value
					};
				}
			} else if (currentStory.questions[0].type === 'open') {
				answerValue = { type: 'open', value: inputsQuestion[0].value, index: 0 };
			}
		} else {
			answerValue = { type: 'storyline' };
		}

		if (answerValue) props.handleNextActivity(answerValue);
	};

	return isLoaded.loaded ? (
		<Container fluid className={props.style.sfondo}>
			<header className={props.style.container}>
				<Row>
					<Col>
						<h1>Al momento ti trovi nell'attività: {props.story.activities[currentStory.activity].name}</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						<h2>Il punteggio attuale è {props.player.status.score}</h2>
					</Col>
				</Row>
			</header>

			<main>
				<section>
					<Row>
						<Col>
							<Button
								variant='dark'
								onClick={() => setShowChat(true)}
								className={props.style.bottone}>
								Apri Chat
								{props.newMessage > 0 ? (
									<Spinner animation='grow' variant='secondary' role='status'>
										<span className='sr-only'>Nuovo messaggio in chat</span>
									</Spinner>
								) : null}
							</Button>
						</Col>
					</Row>
				</section>

				<Chat
					style={props.style}
					show={showChat}
					numberMessages={props.newMessage}
					setNewMessage={props.setNewMessage}
					onHide={() => {
						props.setNewMessage(0);
						setShowChat(false);
					}}
					/* chat={props.player.status.chat} */
					handleSendMessage={props.handleSendMessage}
					chat={props.chat}
				/>

				<section aria-label='Narrazione'>
					{currentStory.storyline.map((value, key) => (
						<Storyline key={key} storyline={value} style={props.style} />
					))}
				</section>

				<hr />

				<section aria-label='Domanda'>
					{currentStory.questions.length ? (
						<Questions
							question={currentStory.questions[0]}
							inputsQuestion={inputsQuestion}
							onChangeAnswer={onChangeAnswer}
							fetchAnswers={fetchAnswers}
							errorAnswer={props.errorAnswer}
							style={props.style}
							waitingOpen={props.waitingOpen}
						/>
					) : (
						<Button
							name='nextActivity'
							variant='dark'
							onClick={e => fetchAnswers(e)}
							className={props.style.bottone}>
							Prosegui all'attività successiva
						</Button>
					)}
				</section>
			</main>
		</Container>
	) : null;
}

export default Story;
