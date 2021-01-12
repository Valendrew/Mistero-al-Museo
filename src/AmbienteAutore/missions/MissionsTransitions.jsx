import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Nav, Tab, Modal, Tabs, InputGroup, Card, ButtonGroup } from 'react-bootstrap';

import ActivityCard from './ActivityCard';

function SelectMission(props) {
	return (
		<Form onSubmit={e => props.handleSubmit(e, props.index)}>
			<InputGroup>
				<Form.Control as='select' name='mission' value={props.input} onChange={e => props.handleSelect(e)}>
					{props.missions.map((value, key) => {
						return (
							<option key={key} value={value}>
								Missione {value}
							</option>
						);
					})}
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
				<Card.Header>Transizione {props.index}</Card.Header>
				<Card.Body>
					{props.index === props.maxTransitions && props.missions.length ? (
						<Row className='mb-4'>
							<Col xs={12}>
								<SelectMission
									index={props.index}
									input={props.input}
									missions={props.missions}
									handleSelect={props.handleSelect}
									handleSubmit={props.handleSubmit}
								/>
							</Col>
						</Row>
					) : null}

					<Row className='row-cols-2 row-cols-sm-3 row-cols-xl-4'>
						{props.transition.map((val, i) => {
							return (
								<Col key={val} className='text-nowrap'>
									Missione {val} {i < props.transition.length - 1 ? '→' : null}
								</Col>
							);
						})}
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
}

function addToObjectNested(data, parentKey, key, value) {
	if (data.hasOwnProperty(parentKey)) {
		data[parentKey][key] = value;
	} else {
		data[parentKey] = { [key]: value };
	}
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
					/>
				);
			})}
		</Row>
	);
}

function MissionsTransitions(props) {
	let history = useHistory();
	const idStory = history.location.state.idStory;

	const [story, setStory] = useState({ error: null, isLoaded: false, items: {} });
	const [missions, setMissions] = useState([]);

	const [input, setInput] = useState();

	const [missionsWithActs, setMissionsWithActs] = useState({});
	const [importedStories, setImportedStories] = useState({});
	const [showImport, setShowImport] = useState(false);
	const [numberActivities, setNumberActivities] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/stories/${idStory}/missions`, {
				method: 'GET'
			});
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();

				const resultAct = await fetch(`/stories/${idStory}/activities`);
				const activities = await resultAct.json();

				setNumberActivities(Object.keys(activities).length);

				let missionsWithAct = {};
				Object.entries(data).forEach(([key, value]) => {
					Object.entries(value).forEach(([i, act]) => {
						if (i === 'start') {
							addToObjectNested(missionsWithAct, key, act, activities[act]);
						} else {
							act.forEach(val => {
								if (val !== 'new_mission') addToObjectNested(missionsWithAct, key, val, activities[val]);
							});
						}
					});
				});
				setMissionsWithActs(missionsWithAct);

				const resultImp = await fetch(`/stories/`);
				const dataImp = await resultImp.json();
				setImportedStories(dataImp.filter(value => value.missions && value.info.id !== idStory));

				setStory({ isLoaded: true, items: data });
				setMissions(Object.keys(data));
			}
		};
		fetchData();
	}, [idStory]);

	useEffect(() => {
		setInput(missions.length ? missions[0] : '');
	}, [missions]);

	const handleSubmit = (e, index) => {
		e.preventDefault();
		let newTransitions = [...props.transitions];
		let newTransition = [...newTransitions[index], input];
		newTransitions[index] = newTransition;
		props.setTransitions(newTransitions);
		setMissions(missions.filter(val => input !== val));
	};

	const handleSelect = e => {
		setInput(e.target.value);
	};

	const resetMissions = e => {
		e.preventDefault();
		setMissions(Object.keys(story.items));
		props.setTransitions(props.transitions.concat([[]]));
	};

	const handleCloseModal = () => {
		setShowImport(false);
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

			await fetch(`/stories/${idStory}/activities/${value}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(importedStories[idImportedStory].activities[key])
			});
		}

		const newMissionsIndex = Object.keys(story.items).length;
		await fetch(`/stories/${idStory}/missions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...story.items, [newMissionsIndex]: newMissions })
		});

		setStory({ ...story, items: { ...story.items, [newMissionsIndex]: newMissions } });
		setMissionsWithActs({ ...missionsWithActs, [newMissionsIndex]: newMissionsWithActs });
		setMissions([...missions, newMissionsIndex.toString()]);

		setNumberActivities(tmpNmbActs);

		setShowImport(false);
	};

	return story.isLoaded ? (
		story.error ? (
			<h5>Errore nel caricamento, riprovare</h5>
		) : (
			<>
				<Row className='my-4'>
					<Col xs={12}>
						<Card>
							<Card.Header>Scegli l'ordine in cui le missioni compariranno nella storia</Card.Header>
							<Card.Body>
								<Row className='row-cols-1 row-cols-lg-2'>
									{props.transitions.map((value, key) => {
										return (
											<TransitionsListGroup
												transition={value}
												key={key}
												index={key}
												input={input}
												missions={missions}
												handleSelect={handleSelect}
												handleSubmit={handleSubmit}
												maxTransitions={props.transitions.length - 1}
											/>
										);
									})}
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

				<Modal dialogClassName='modal-lg' show={showImport} onHide={handleCloseModal}>
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
													<Button onClick={() => handleImport(key, numberMis)}>Missione {numberMis}</Button>
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
		<h5>Loading</h5>
	);
}
export default MissionsTransitions;
