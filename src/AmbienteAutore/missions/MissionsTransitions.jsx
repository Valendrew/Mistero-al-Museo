import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SelectMission(props) {
	return (
		<Form onSubmit={(e) => props.handleSubmit(e)}>
			<Form.Group>
				<Col>
					<Form.Group as="select" name="mission" value={props.input} onChange={(e) => props.handleSelect(e)}>
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
					<Button variant="success" type="submit">
						Procedi
					</Button>
				</Col>
			</Form.Group>
		</Form>
	);
}

function MissionsTransitions() {
	let history = useHistory();
	let match = useRouteMatch("/autore");

	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const [missions, setMissions] = useState([]);
	const [transitions, setTransitions] = useState([]);
	const [input, setInput] = useState();
	const idStory = 1;

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/story/${idStory}/missions`, {
				method: "GET",
				headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
			});
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({ isLoaded: true, items: data });
				setMissions(Object.keys(data));
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		setInput(missions.length ? missions[0] : "");
	}, [missions]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setTransitions(transitions.concat([input]));
		setMissions(missions.filter((val) => input !== val));
	};

	const handleSelect = (e) => {
		setInput(e.target.value);
	};

	const createStory = () => {
		fetch(`/story/${idStory}/transitions`, {
			method: "POST",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "application/json" },
			body: JSON.stringify(transitions),
		})
			.then((response) => {
				history.push(`${match.url}/story`, { idStory: idStory });
			})
			.catch(console.log);
	};

	return (
		<Container fluid>
			<Row>
				{story.isLoaded ? (
					story.error ? (
						<h5>Errore nel caricamento, riprovare</h5>
					) : (
						<ListGroup variant="flush">
							{transitions.map((value) => {
								return <ListGroup.Item key={value}>Missione {value}</ListGroup.Item>;
							})}
							<ListGroup.Item>
								{missions.length ? (
									<SelectMission
										key={missions.length}
										input={input}
										missions={missions}
										handleSelect={handleSelect}
										handleSubmit={handleSubmit}
									/>
								) : (
									<Button variant="primary" onClick={createStory}>
										Crea storia
									</Button>
								)}
							</ListGroup.Item>
						</ListGroup>
					)
				) : (
					<h5>Loading</h5>
				)}
			</Row>
		</Container>
	);
}
export default MissionsTransitions;
