import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ActivityCard from "./ActivityCard";
import Missions from "./Missions";

function Activities() {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const history = useHistory();
	const match = useRouteMatch("/autore/story");
	const idStory = 1;

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/story/${idStory}/activities`, {
				method: "GET",
				headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "application/json" },
			});
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				result.json().then((data) => setStory({ isLoaded: true, items: data }));
			}
		};
		fetchData();
	}, []);

	const fetchMissions = (missions) => {
		fetch(`/story/${idStory}/missions`, {
			method: "POST",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "application/json" },
			body: JSON.stringify(missions),
		})
			.then((response) => {
				history.push(`${match.url}/transitions`);
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
							{story.items.map((value, i) => {
								return <ActivityCard key={i} id={i} storyline={value["storyline"]} />;
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
