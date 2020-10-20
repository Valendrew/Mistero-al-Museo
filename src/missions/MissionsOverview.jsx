import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActivityCard from "./ActivityCard";
import Missions from "./Missions";

function Activities() {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const history = useHistory();
	const idStory = 1;

	useEffect(() => {
		fetch(`/story/activities/${idStory}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then(
				(result) => {
					setStory({
						isLoaded: true,
						items: result,
					});
				},
				(error) => {
					setStory({
						isLoaded: true,
						error,
					});
				}
			);
	}, []);

	const fetchMissions = (missions) => {
		fetch(`/story/missions/${idStory}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(missions),
		}).then((response) => {
			history.push("/missions/transitions");
		});
	};

	return (
		<Container fluid>
			{story.isLoaded ? (
				<>
					<Row className="row-cols-6">
						{story.items.map((value, i) => {
							return <ActivityCard key={i} id={i} storyline={value["storyline"]} />;
						})}
					</Row>
					<Row>
						<Missions activities={story.items} fetchMissions={fetchMissions} />
					</Row>
				</>
			) : (
				<h1>Loading...</h1>
			)}
		</Container>
	);
}

export default Activities;
