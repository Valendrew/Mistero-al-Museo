import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MissionsTransitions from '../missions/MissionsTransitions';
import StoryTheme from './StoryTheme';
import FinalMessages from './FinalMessages';
import { Button, Tabs, Tab } from 'react-bootstrap';

function saveData(idStory, finalMessages, transitions, history) {
	fetch(`/stories/${idStory}/finalMessages`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(finalMessages)
	})
		.then(() => {
			fetch(`/stories/${idStory}/transitions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(transitions)
			})
				.then(response => {
					history.push(`overview`, { idStory: idStory });
				})
				.catch(console.log);
		})
		.catch(console.log);
}

function StoryConclusion() {
	let history = useHistory();
	const idStory = history.location.state.idStory;
	const [finalMessages, setFinalMessages] = useState({});
	const [transitions, setTransitions] = useState([[]]);
	return (
		<>
			<Tabs>
				<Tab eventKey='Transizioni' title='Transizioni'>
					{/* Transizioni missioni */}
					<MissionsTransitions transitions={transitions} setTransitions={setTransitions} />
				</Tab>
				<Tab eventKey='Temi' title='Temi'>
					{/* Temi del player */}
					{/*<StoryTheme />*/}
				</Tab>
				<Tab eventKey='Messaggio conclusivo' title='Messaggio conclusivo'>
					{/* Fasce conclusive storia */}
					<FinalMessages setFinalMessages={setFinalMessages} finalMessages={finalMessages} />
				</Tab>
			</Tabs>
			<Button onClick={() => saveData(idStory, finalMessages, transitions, history)}>Concludi storia</Button>
		</>
	);
}

export default StoryConclusion;
