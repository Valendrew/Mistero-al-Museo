import React from 'react';
import { Container } from 'react-bootstrap';

function findMessage(messagesSorted, playerScore) {
	let message = '';
	messagesSorted.forEach((elem, index) => {
		console.log(index);
		if (elem[0].score) {
			if (playerScore <= elem[0].score && message === '') {
				message = elem[0].message;
			}
		}
	});
	if (message !== '') return message;
	else return messagesSorted[messagesSorted.length - 1][0].message;
}

function getMessage(finalMessages, playerScore) {
	const messagesSorted = Object.entries(finalMessages).sort(([key, val], [key_2, val_2]) => key - key_2);
	messagesSorted.forEach((elem, index) => {
		messagesSorted[index] = elem.slice(1, 2);
	});

	return findMessage(messagesSorted, playerScore);
}

function EndGame(props) {
	return (
		<Container fluid className={props.style.sfondo}>
			<main className={props.style.container}>
				<h1>Hai terminato la storia con {props.playerScore} punti</h1>
				<h2>{getMessage(props.finalMessages, props.playerScore)}</h2>
				<h3>Chiudi la finestra per uscire dalla partita</h3>
			</main>
		</Container>
	);
}

export default EndGame;
