import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Nav, Tab } from 'react-bootstrap';

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
		<Row className='row row-cols-1 row-cols-sm-3'>
			{Object.entries(props.activities).map(([key, value]) => {
				return <ActivityCard key={key} id={parseInt(key)} storyline={value.storyline} height='30vh' />;
			})}
		</Row>
	);
}

function MissionsTransitions() {
	let history = useHistory();
	const idStory = history.location.state.idStory;

	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const [missions, setMissions] = useState([]);
	const [transitions, setTransitions] = useState([[]]);
	const [input, setInput] = useState();
	const [missionsWithActs, setMissionsWithActs] = useState({});

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
				console.log(missionsWithAct);
				setMissionsWithActs(missionsWithAct);

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
		let newTransitions = [...transitions];
		let newTransition = [...newTransitions[index], input];
		newTransitions[index] = newTransition;
		setTransitions(newTransitions);
		setMissions(missions.filter(val => input !== val));
	};

	const handleSelect = e => {
		setInput(e.target.value);
	};

	const resetMissions = e => {
		e.preventDefault();
		setMissions(Object.keys(story.items));
		setTransitions(transitions.concat([[]]));
	};

	const createStory = () => {
		fetch(`/stories/${idStory}/transitions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(transitions)
		})
			.then(response => {
				history.push(`overview`, { idStory: idStory });
			})
			.catch(console.log);
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
										{Object.entries(missions).map(([key, value]) => {
											return (
												<Nav.Item>
													<Nav.Link eventKey={value}>Missione {value}</Nav.Link>
												</Nav.Item>
											);
										})}
									</Nav>
								</Col>

								<Col sm={9}>
									<Tab.Content>
										{Object.entries(missions).map(([key, value]) => {
											return (
												<Tab.Pane eventKey={value}>
													<ActivityCards activities={missionsWithActs[value]} />
												</Tab.Pane>
											);
										})}
									</Tab.Content>
								</Col>
							</Row>
						</Tab.Container>
						<Row>
							<h5>Crea transizioni per le missioni</h5>
							{transitions.map((value, key) => {
								return (
									<TransitionsListGroup
										transition={value}
										key={key}
										index={key}
										input={input}
										missions={missions}
										handleSelect={handleSelect}
										handleSubmit={handleSubmit}
										maxTransitions={transitions.length - 1}
									/>
								);
							})}
						</Row>

						<Row>
							<Col>
								{missions.length ? null : (
									<>
										<Button variant='primary' onClick={createStory}>
											Crea storia
										</Button>
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
