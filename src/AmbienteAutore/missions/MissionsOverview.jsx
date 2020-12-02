import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import ActivityCard from './ActivityCard';
import Missions from './Missions';

function Activities() {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: {} });
	const [missions, setMissions] = useState();
	const history = useHistory();
	const idStory = history.location.state.idStory;
	const action = history.location.state.action;

	useEffect(() => {
		const fetchData = async () => {
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

	return (
		<Container fluid>
			{story.isLoaded ? (
				story.error ? (
					<h5>Errore nel caricamento, riprovare</h5>
				) : (
					<>
						<Row className='row row-cols-4 row-cols-lg-6'>
							{Object.entries(story.items).map(([key, value]) => {
								return <ActivityCard key={key} id={parseInt(key)} storyline={value.storyline} />;
							})}
						</Row>
						<Row>
							<Missions activities={story.items} fetchMissions={fetchMissions} missions={missions} />
						</Row>
					</>
				)
			) : (
				<h5>Loading...</h5>
			)}
		</Container>
	);
}

export default Activities;
