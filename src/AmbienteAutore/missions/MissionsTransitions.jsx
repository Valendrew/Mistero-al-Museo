import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Nav, Tab, Modal, Tabs } from 'react-bootstrap';

import ActivityCard from './ActivityCard';

function SelectMission(props) {
	return (
		<Form onSubmit={e => props.handleSubmit(e, props.index)}>
			<Form.Group>
				<Col>
					<Form.Group as='select' name='mission' value={props.input} onChange={e => props.handleSelect(e)}>
						{props.missions.map((value, key) => {
							return (
								<option key={key} value={value}>
									Missione {value}
								</option>
							);
						})}
					</Form.Group>
				</Col>
				<Col>
					<Button variant='success' type='submit'>
						Procedi
					</Button>
				</Col>
			</Form.Group>
		</Form>
	);
}

function TransitionsListGroup(props) {
	return (
		<Col>
			<ListGroup variant='flush'>
				<h6>Transizione {props.index}</h6>
				{props.transition.map(val => {
					return <ListGroup.Item key={val}>Missione {val}</ListGroup.Item>;
				})}
				{props.index === props.maxTransitions && props.missions.length ? (
					<SelectMission
						index={props.index}
						input={props.input}
						missions={props.missions}
						handleSelect={props.handleSelect}
						handleSubmit={props.handleSubmit}
					/>
				) : null}
			</ListGroup>
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
				overflowX: 'auto',
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

	return (
		<Container fluid>
			{story.isLoaded ? (
				story.error ? (
					<h5>Errore nel caricamento, riprovare</h5>
				) : (
					<>
						<Tab.Container defaultActiveKey='0'>
							<Row>
								<Col sm={3}>
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
						<Row>
							<h5>Crea transizioni per le missioni</h5>
							<Button onClick={() => setShowImport(true)}>Importa missioni da altre storie</Button>

							<Modal show={showImport} onHide={handleCloseModal}>
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
						</Row>
						<Row>
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

						<Row>
							<Col>
								{missions.length ? null : (
									<>
										<Button variant='primary' onClick={resetMissions}>
											Aggiungi altra transizione parallela
										</Button>
									</>
								)}
							</Col>
						</Row>
					</>
				)
			) : (
				<h5>Loading</h5>
			)}
		</Container>
	);
}
export default MissionsTransitions;
