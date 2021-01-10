import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import ActivityCard from './ActivityCard';
import Missions from './Missions';
import { Col, ListGroup, Modal, Tab, Tabs } from 'react-bootstrap';

function MissionsOverview() {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: {} });
	const [importedStories, setImportedStories] = useState({ error: null, items: {} });
	const [missions, setMissions] = useState();
	const history = useHistory();
	const idStory = history.location.state.idStory;
	const action = history.location.state.action;

	const [showImport, setShowImport] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			fetch(`/stories/`)
				.then(result => result.json())
				.then(data => {
					setImportedStories({ items: data.filter(value => value.activities && value.info.id != idStory) });
				});

			let result = await fetch(`/stories/${idStory}/activities`);
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				if (action) {
					const resultMissions = await fetch(`/stories/${idStory}/missions`);
					if (resultMissions.ok) {
						let dataMissions;
						try {
							dataMissions = await resultMissions.json();
						} catch (e) {
							dataMissions = null;
							console.log('nessuna missione trovata');
						}
						setMissions(dataMissions);
					}
				}
				setStory({ isLoaded: true, items: data });
			}
		};
		fetchData();
	}, [idStory, action]);

	const fetchMissions = async missions => {
		await fetch(`/stories/${idStory}/transitions`, { method: 'DELETE' });

		fetch(`/stories/${idStory}/missions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(missions)
		})
			.then(response => {
				history.push('conclusion', { idStory: idStory });
			})
			.catch(console.log);
	};

	const handleCloseModal = () => {
		setShowImport(false);
	};

	const handleImport = async (idImportedStory, numberActivity) => {
		const newActivityIndex = Object.keys(story.items).length;
		setStory({
			...story,
			items: { ...story.items, [newActivityIndex]: importedStories.items[idImportedStory].activities[numberActivity] }
		});

		await fetch(`/stories/${idStory}/activities/${newActivityIndex}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(importedStories.items[idImportedStory].activities[numberActivity])
		});
		setShowImport(false);
	};

	return (
		<Container fluid>
			{story.isLoaded ? (
				story.error ? (
					<h5>Errore nel caricamento, riprovare</h5>
				) : (
					<>
						<Row className='row row-cols-1 row-cols-sm-2 row-cols-xl-4'>
							{Object.entries(story.items).map(([key, value]) => {
								return <ActivityCard key={key} id={parseInt(key)} storyline={value.storyline} />;
							})}

							<Button className='my-2' style={{ height: '25%' }} onClick={() => setShowImport(true)}>
								Importa attività da storie differenti
							</Button>
						</Row>
						<Row>
							<Missions activities={story.items} fetchMissions={fetchMissions} missions={missions} />
						</Row>

						<Modal show={showImport} onHide={handleCloseModal}>
							<Modal.Header closeButton>
								<Modal.Title>Importa attività</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Tabs defaultActiveKey='0' id='uncontrolled-tab-example'>
									{importedStories.items.map((value, key) => (
										<Tab eventKey={key} title={value.info.name}>
											<ListGroup variant='flush'>
												{Object.entries(value.activities).map(([numberAct, value]) => {
													return (
														<ListGroup.Item>
															<Button onClick={() => handleImport(key, numberAct)}>{value.name}</Button>
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
				<h5>Loading...</h5>
			)}
		</Container>
	);
}

export default MissionsOverview;
