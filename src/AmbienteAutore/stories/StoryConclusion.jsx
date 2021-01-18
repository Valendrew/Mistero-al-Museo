import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MissionsTransitions from '../missions/MissionsTransitions';
import StoryTheme from './StoryTheme';
import FinalMessages from './FinalMessages';
import Accessibilita from './Accessibilita';
import { Button, Tabs, Tab, Container } from 'react-bootstrap';

function StoryConclusion() {
	let history = useHistory();
	const idStory = history.location.state.idStory;
	const action = history.location.state.action;

	/* Oggetto contenente la storia */
	const [story, setStory] = useState({});
	/* Booleano che si riferisce alla checkbox per abilitare l'accessibilità */
	const [accessibilita, setAccessibilita] = useState(false);
	/* Oggetto contenente gli input per impostare il messaggio conclusivo della storia */
	const [finalMessages, setFinalMessages] = useState({
		0: { score: 0, message: '' },
		1: { score: 1, message: '' },
		2: { message: '' }
	});
	/* Vettore di tutte le transizioni presenti nella storia */
	const [transitions, setTransitions] = useState([[]]);
	/* Stringa contentente il tema attualmente selezionato */
	const [tema, setTema] = useState('generico');
	/* Oggetto per indicare quando la pagina può essere caricata */
	const [loaded, setLoaded] = useState({ isLoaded: false, error: '' });
	/* Messaggio di errore nella submit */
	const [error, setError] = useState(undefined);

	useEffect(() => {
		const fetchStory = async () => {
			if (idStory) {
				/* Richiesto oggetto della storia  */
				const result = await fetch(`/stories/${idStory}`);

				/* Nel caso la richiesta non sia andata a buon fine */
				if (!result.ok) setLoaded({ isLoaded: true, error: result.statusText });
				else {
					const data = await result.json();

					if (data.info.hasOwnProperty('theme')) setTema(data.info.theme);

					/* Reimpostati i messaggi conclusivi già inseriti */
					if (data.hasOwnProperty('finalMessages')) {
						const msgs = data.finalMessages;
						setFinalMessages({
							0: { score: msgs['0'].score, message: msgs['0'].message },
							1: { score: msgs['1'].score, message: msgs['1'].message },
							2: { message: msgs['2'].message }
						});
					}

					/* Reimpostata l'accessibilità già inserito */
					if (data.info.hasOwnProperty('accessibility')) setAccessibilita(data.info.accessibility);
					
					/* Se è specificata un'action allora è stata richiesta una modifica di una storia esistente,
					per questo verranno reimpostati i valori presenti nell'oggetto */
					if (action) {
						/* Reimpostato il tema già inserito */

						/* Reimpostate le transizioni già inserite */
						if (data.hasOwnProperty('transitions')) {
							setTransitions(data.transitions);
						}
					}
					setStory(data);
					setLoaded({ isLoaded: true });
				}
			} else setLoaded({ isLoaded: true, error: 'id not valid' });
		};

		if (!loaded.isLoaded) fetchStory();
	}, [action, idStory, loaded]);

	const saveData = async () => {
		if (fetchForEmptyTransitions()) {
			setError(<p className='text-danger'>Transizioni non completate, controlla i campi</p>);
		} else if (fetchForEmptyMessages()) {
			setError(
				<p className='text-danger'>Messaggi conclusivi non completati, controlla i campi</p>
			);
		} else {
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

			const resultA = await fetch(`/stories/${idStory}/accessibility`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ value: accessibilita })
			});

			const resultTheme = await fetch(`/stories/${idStory}/theme`, {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: tema
			});

			if (resultF.ok && resultT.ok && resultA.ok && resultTheme.ok) {
				history.push(`overview`, { idStory: idStory });
			}
			setError(undefined);
		}
	};

	const fetchForEmptyTransitions = () => {
		for (let _elements of transitions) {
			if (_elements.length === 0) return true;
		}
		return false;
	};

	const fetchForEmptyMessages = () => {
		for (let _elements of Object.values(finalMessages)) {
			if (!_elements.message.trim()) return true;
		}
		return false;
	};

	return loaded.isLoaded ? (
		loaded.error ? (
			<h1>Errore nel caricamento: {loaded.error}</h1>
		) : (
			<Container>
				<Tabs defaultActiveKey='Transizioni'>
					{/* Transizioni missioni */}
					<Tab eventKey='Transizioni' title='Transizioni'>
						<MissionsTransitions
							story={story}
							setStory={setStory}
							transitions={transitions}
							setTransitions={setTransitions}
							idStory={idStory}
						/>
					</Tab>

					{/* Temi del player */}
					<Tab eventKey='Temi' title='Temi'>
						<StoryTheme setTema={setTema} tema={tema} />
					</Tab>

					{/* Frasi conclusive storia */}
					<Tab eventKey='Messaggio conclusivo' title='Messaggio conclusivo'>
						<FinalMessages setFinalMessages={setFinalMessages} finalMessages={finalMessages} />
					</Tab>

					{/* Checkbox per l'accessibilità */}
					<Tab eventKey='Accessibilità' title='Accessibilità'>
						<Accessibilita setAccessibilita={setAccessibilita} accessibilita={accessibilita} />
					</Tab>
				</Tabs>
				<Button className='mt-4' onClick={() => saveData()}>
					Concludi storia
				</Button>
				{error}
			</Container>
		)
	) : (
		<h1>Loading...</h1>
	);
}

export default StoryConclusion;
