import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActivityCard from "./ActivityCard";
import Missions from "./Missions";

function Activities() {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: {} });
	const history = useHistory();
	const idStory = history.location.state.id;

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/stories/${idStory}/activities`, {
				method: "GET",
			});
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				result.json().then((data) => setStory({ isLoaded: true, items: data }));
			}
		};
		fetchData();
	}, [idStory]);

	const fetchMissions = (missions) => {
		fetch(`/stories/${idStory}/missions`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(missions),
		})
			.then((response) => {
				history.push("transitions", { id: idStory });
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
						<Row className="row row-cols-4 row-cols-lg-6">
							{Object.entries(story.items).map(([key, value]) => {
								return <ActivityCard key={key} idStory={idStory} id={parseInt(key)} storyline={value.storyline} />;
							})}
						</Row>
						<Row>
							<Missions activities={story.items} fetchMissions={fetchMissions} />
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
