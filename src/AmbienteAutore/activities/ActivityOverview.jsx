import React, { useEffect, useState } from 'react';
import ActivityCard from './ActivityCard';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';

function ActivityOverview() {
	const [activities, setActivities] = useState({ isLoaded: false, error: null, item: {} });
	const history = useHistory();
	const idStory = history.location.state.idStory;

	useEffect(() => {
		const fetchData = async () => {
			let result = await fetch(`/stories/${idStory}/activities`);
			if (!result.ok) setActivities({ isLoaded: true, error: result.statusText });
			else {
				result
					.json()
					.then(data => {
						setActivities({ isLoaded: true, items: data });
					})
					.catch(e => console.log(e));
			}
		};
		if (!activities.isLoaded) fetchData();
	}, [idStory, activities]);

	const onEditActivity = async (e, id) => {
		history.push('activity', { idStory: idStory, idActivity: id, action: 'activityToEdit' });
	};

	const onRemoveActivity = async (e, id) => {
		await fetch(`/stories/${idStory}/activities/${id}`, {
			method: 'DELETE'
		});
		setActivities({ isLoaded: false });
	};

	return (
		<Container>
			{activities.isLoaded ? (
				activities.error ? (
					<h5>Errore caricamento</h5>
				) : (
					<Row className='row row-cols-1 row-cols-sm-2 row-cols-xl-4'>
						{Object.entries(activities.items).map(([key, value]) => (
							<ActivityCard
								key={key}
								id={parseInt(key)}
								activity={value}
								onEditActivity={onEditActivity}
								onRemoveActivity={onRemoveActivity}
							/>
						))}
					</Row>
				)
			) : (
				<h5>Caricamento...</h5>
			)}
		</Container>
	);
}

export default ActivityOverview;
