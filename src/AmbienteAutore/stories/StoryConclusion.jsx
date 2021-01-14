import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import MissionsTransitions from '../missions/MissionsTransitions';
import StoryTheme from './StoryTheme';
import FinalMessages from './FinalMessages';
import Accessibilita from './Accessibilita';
import { Button, Tabs, Tab, Container, Overlay, Tooltip } from 'react-bootstrap';

function StoryConclusion(props) {
	let history = useHistory();
	const idStory = history.location.state.idStory;
	
	const [accessibilita, setAccessibilita] = useState(false);

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

		const resultA = await fetch(`/stories/${idStory}/accessibilita`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({value: accessibilita})
		});

		if (resultF.ok && resultT.ok && resultA.ok) {
			history.push(`overview`, { idStory: idStory });
		}
	};

	return (
		<Container>
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
				<Tab eventKey='Accessibilità' title='Accessibilità'>
					<Accessibilita setAccessibilita={setAccessibilita} accessibilita={accessibilita}/>
				</Tab>
			</Tabs>
			<Button className='mt-4' onClick={() => saveData(idStory, finalMessages, transitions, history)}>
				Concludi storia
			</Button>
		</Container>
	);
}

export default StoryConclusion;
