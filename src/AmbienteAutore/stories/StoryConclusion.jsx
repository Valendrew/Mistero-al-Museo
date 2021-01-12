import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MissionsTransitions from '../missions/MissionsTransitions';
import StoryTheme from './StoryTheme';
import FinalMessages from './FinalMessages';
import { Button, Tabs, Tab, Container } from 'react-bootstrap';

function StoryConclusion() {
	let history = useHistory();
	const idStory = history.location.state.idStory;

	const [finalMessages, setFinalMessages] = useState({
		0: { score: 0, message: '' },
		1: { score: 1, message: '' },
		2: { message: '' }
	});
	const [transitions, setTransitions] = useState([[]]);

	const saveData = async (idStory, finalMessages, transitions) => {
		const resultF = await fetch(`/stories/${idStory}/finalMessages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(finalMessages)
		});

		const resultT = await fetch(`/stories/${idStory}/transitions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(transitions)
		});
		if (resultF.ok && resultT.ok) {
			history.push(`overview`, { idStory: idStory });
		}
	};

	return (
		<Container fluid>
			<Tabs>
				<Tab eventKey='Transizioni' title='Transizioni'>
					{/* Transizioni missioni */}
					<MissionsTransitions transitions={transitions} setTransitions={setTransitions} />
				</Tab>
				<Tab eventKey='Temi' title='Temi'>
					{/* Temi del player */}
					<StoryTheme />
				</Tab>
				<Tab eventKey='Messaggio conclusivo' title='Messaggio conclusivo'>
					{/* Fasce conclusive storia */}
					<FinalMessages setFinalMessages={setFinalMessages} finalMessages={finalMessages} />
				</Tab>
			</Tabs>
			<Button className='mt-4' onClick={() => saveData(idStory, finalMessages, transitions, history)}>
				Concludi storia
			</Button>
		</Container>
	);
}

export default StoryConclusion;
