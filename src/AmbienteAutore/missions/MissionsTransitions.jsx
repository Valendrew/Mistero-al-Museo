import React, { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Nav, Tab, Modal, Tabs, InputGroup, Card, ButtonGroup, Button } from 'react-bootstrap';

import ActivityCard from './ActivityCard';

function SelectMission(props) {
	return (
		<Form onSubmit={e => props.handleSubmit(e, props.index)}>
			<InputGroup>
				<Form.Control
					as='select'
					name='mission_select'
					value={props.input}
					onChange={e => props.handleSelect(e)}>
					{props.missions.map((value, key) => (
						<option key={key} value={value}>
							Missione {value}
						</option>
					))}
				</Form.Control>
				<InputGroup.Append>
					<Button variant='success' type='submit'>
						Procedi
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</Form>
	);
}

function TransitionsListGroup(props) {
	return (
		<Col className='mb-2'>
			<Card>
				<Card.Header>
					Transizione {props.index}
					<Button
						className='ml-4'
						variant='danger'
						onClick={() => props.removeTransition(props.index)}>
						&times;
					</Button>
				</Card.Header>
				<Card.Body>
					{props.index === props.maxTransitions && props.missions.length ? (
						<Row className='mb-4'>
							<Col xs={12}>
								<SelectMission {...props} />
							</Col>
						</Row>
					) : null}

					<Row className='row-cols-2 row-cols-sm-3 row-cols-xl-4'>
						{props.transition.map((_mission, i) => {
							return (
								<Col key={_mission} className='text-nowrap'>
									Missione {_mission} {i < props.transition.length - 1 ? '→' : null}
								</Col>
							);
						})}
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
}

function ActivityCards(props) {
	return (
		<Row
			style={{
				overflowX: 'scroll',
				whiteSpace: 'nowrap',
				display: 'block'
			}}>
			{Object.entries(props.activities).map(([key, value]) => {
				return (
					<ActivityCard
						key={key}
						id={parseInt(key)}
						storyline={value.storyline}
						height='30vh'
						style={{ display: 'inline-block', width: '300px' }}
						value={value}
						questions={value.questions}
					/>
				);
			})}
		</Row>
	);
}

function MissionsTransitions(props) {
	/* Oggetto per indicare se la pagina può essere caricata */
	const [loaded, setLoaded] = useState({ isLoaded: false, error: '' });
	/* Missioni selezionabili dalla select */
	const [missions, setMissions] = useState([]);
	/* Valore della select per selezionare la missione */
	const [input, setInput] = useState();
	/* Booleano per attivare il dialog per importare altre missioni */
	const [showImport, setShowImport] = useState(false);
	/* Numero delle attività nella storia */
	const [numberActivities, setNumberActivities] = useState();
	/* Le attività delle missioni della storia */
	const [missionsWithActs, setMissionsWithActs] = useState();
	/* Le storie dell'utente da poter importare*/
	const [importedStories, setImportedStories] = useState();

	/* useEffect iniziale */
	useEffect(() => {
		/* Per caricare i dati al caricamento della pagina */
		const fetchData = async () => {
			/* Impostato il numero delle attività nella storia */
			setNumberActivities(Object.keys(props.story.activities).length);

			let newMissionsWithActs = {};

			/* Funzione per aggiungere ad un oggetto un valore */
			const addToObjectNested = (parentKey, key, value) => {
				if (newMissionsWithActs.hasOwnProperty(parentKey)) {
					newMissionsWithActs[parentKey][key] = value;
				} else {
					newMissionsWithActs[parentKey] = { [key]: value };
				}
			};

			/* Per ogni missione della storia vengono controllate tutte le 
			attività che la compongono, in modo tale da aggiungerle a missionsWithActs,
			per poter così visualizzare il loro riepilogo */
			Object.entries(props.story.missions).forEach(([key, value]) => {
				Object.entries(value).forEach(([i, act]) => {
					if (i === 'start') addToObjectNested(key, act, props.story.activities[act]);
					else {
						act.forEach(val => {
							if (val !== 'new_mission') addToObjectNested(key, val, props.story.activities[val]);
						});
					}
				});
			});
			setMissionsWithActs(newMissionsWithActs);

			/* Impostato il vettore contenente le missioni selezionabili dalla select */
			setMissions(
				Object.keys(props.story.missions).filter(_missionToFilter => {
					/* Controllate tutte le transizioni della storia per verificare
					se la missione ricercata ne fa parte */
					for (let _transition of props.transitions) {
						for (let _mission of _transition) {
							if (parseInt(_mission) === parseInt(_missionToFilter)) return false;
						}
					}
					return true;
				})
			);

			/* Richieste tutte le storie dell'utente, che vengono aggiunte per essere importate */
			const result = await fetch(`/stories/`);
			if (!result.ok) setLoaded({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setImportedStories(data.filter(value => value.missions && value.info.id !== props.idStory));

				setLoaded({ isLoaded: true });
			}
		};

		if (!loaded.isLoaded) fetchData();
	}, [loaded, props]);

	/* useEffect per aggiornare il valore della select */
	useEffect(() => {
		/* Per aggiornare la select delle missioni disponibili per essere selezionate */
		setInput(missions.length ? missions[0] : '');
	}, [missions]);

	/* Submit della form per selezionare la missione della transizione */
	const handleSubmit = (e, index) => {
		e.preventDefault();

		let newTransitions = [...props.transitions];
		newTransitions[index].push(input);
		/* let newTransition = [...newTransitions[index], input];
		newTransitions[index] = newTransition; */
		props.setTransitions(newTransitions);
		setMissions(missions.filter(val => parseInt(input) !== parseInt(val)));
	};

	/* Per gestire l'evento onChange della select */
	const handleSelect = e => {
		setInput(e.target.value);
	};

	const resetMissions = e => {
		e.preventDefault();

		setMissions(Object.keys(props.story.missions));
		props.setTransitions(props.transitions.concat([[]]));
	};

	/* Per gestire la rimozione di una transizione */
	const removeTransition = index => {
		if (props.transitions.length === 1) {
			props.setTransitions([[]]);

			setMissions(Object.keys(props.story.missions));
		} else {
			let newTransitions = [...props.transitions];
			newTransitions.splice(index, 1);

			setMissions([]);
			props.setTransitions(newTransitions);
		}
	};

	const handleImport = async (idImportedStory, numberMission) => {
		const tmpMissions = { ...importedStories[idImportedStory].missions[numberMission] };
		let newMissions = {};
		let tmpNmbActs = numberActivities;
		let numberConverter = {};

		let newMissionsWithActs = {};

		const converterFunction = act => {
			if (!numberConverter.hasOwnProperty(act)) {
				numberConverter[act] = tmpNmbActs;
				tmpNmbActs++;
			}
			return numberConverter[act];
		};

		Object.entries(tmpMissions).forEach(([key, value]) => {
			if (key === 'start') {
				newMissions[key] = converterFunction(value);
			} else {
				const newMissionI = converterFunction(key);
				newMissions[newMissionI] = [];

				value.forEach((val, i) => {
					if (val !== 'new_mission') {
						newMissions[newMissionI].push(converterFunction(val));
					} else {
						newMissions[newMissionI].push(val);
					}
				});
			}
		});

		for (const [key, value] of Object.entries(numberConverter)) {
			newMissionsWithActs[value] = importedStories[idImportedStory].activities[key];

			await fetch(`/stories/${props.idStory}/activities/${value}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(importedStories[idImportedStory].activities[key])
			});
		}

		const newMissionsIndex = Object.keys(props.story.missions).length;
		await fetch(`/stories/${props.idStory}/missions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...props.story.missions, [newMissionsIndex]: newMissions })
		});

		props.setStory({
			loaded: true,
			items: {
				...props.story,
				missions: { ...props.story.missions, [newMissionsIndex]: newMissions }
			}
		});
		setMissionsWithActs({ ...missionsWithActs, [newMissionsIndex]: newMissionsWithActs });
		setMissions([...missions, newMissionsIndex.toString()]);

		setNumberActivities(tmpNmbActs);

		setShowImport(false);
	};

	return loaded.isLoaded ? (
		loaded.error ? (
			<h1>Errore nel caricamento: {loaded.error} </h1>
		) : (
			<>
				<Row className='my-4'>
					<Col xs={12}>
						<Card>
							<Card.Header>
								Scegli l'ordine in cui le missioni compariranno nella storia
							</Card.Header>
							<Card.Body>
								<Row className='row-cols-1 row-cols-lg-2'>
									{props.transitions.map((value, key) => (
										<TransitionsListGroup
											key={key}
											transition={value}
											index={key}
											input={input}
											missions={missions}
											handleSelect={handleSelect}
											handleSubmit={handleSubmit}
											removeTransition={removeTransition}
											maxTransitions={props.transitions.length - 1}
										/>
									))}
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row className='mb-4'>
					<ButtonGroup>
						<Button onClick={() => setShowImport(true)}>Importa missioni da altre storie</Button>

						{missions.length ? null : (
							<Button variant='primary' onClick={resetMissions}>
								Aggiungi altra transizione parallela
							</Button>
						)}
					</ButtonGroup>
				</Row>

				<Tab.Container defaultActiveKey='0'>
					<Row>
						<Col sm={3} style={{ overflowY: 'scroll' }}>
							<Nav variant='pills' className='flex-column'>
								{Object.keys(missionsWithActs).map(value => {
									return (
										<Nav.Item key={value}>
											<Nav.Link eventKey={value}>Missione {value}</Nav.Link>
										</Nav.Item>
									);
								})}
							</Nav>
						</Col>

						<Col sm={9}>
							<Tab.Content>
								{Object.entries(missionsWithActs).map(([key, value]) => {
									return (
										<Tab.Pane key={key} eventKey={key}>
											<ActivityCards activities={value} />
										</Tab.Pane>
									);
								})}
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>

				<Modal dialogClassName='modal-lg' show={showImport} onHide={() => setShowImport(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Importa attività</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Tabs defaultActiveKey='0' id='uncontrolled-tab-example'>
							{importedStories.map((value, key) => (
								<Tab key={key} eventKey={key} title={value.info.name}>
									<ListGroup variant='flush'>
										{Object.entries(value.missions).map(([numberMis, value]) => {
											return (
												<ListGroup.Item key={numberMis}>
													<Button onClick={() => handleImport(key, numberMis)}>
														Missione {numberMis}
													</Button>
												</ListGroup.Item>
											);
										})}
									</ListGroup>
								</Tab>
							))}
						</Tabs>
					</Modal.Body>
				</Modal>
			</>
		)
	) : (
		<h1>Loading...</h1>
	);
}
export default MissionsTransitions;
