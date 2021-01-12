import React, { useState } from 'react';

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
		<>
			<h2>Hai terminato la storia con {props.playerScore} punti</h2>
			{getMessage(props.finalMessages, props.playerScore)}
		</>
	);
}

export default EndGame;
