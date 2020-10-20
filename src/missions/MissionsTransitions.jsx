import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

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
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const [missions, setMissions] = useState([]);
	const [transitions, setTransitions] = useState([]);
	const [input, setInput] = useState();
	let history = useHistory();
	const idStory = 1;

	useEffect(() => {
		fetch(`/story/missions/${idStory}`)
			.then((res) => res.json())
			.then(
				(result) => {
					setStory({
						isLoaded: true,
						items: result,
					});
					setMissions(Object.keys(result));
				},
				(error) => {
					setStory({
						isLoaded: true,
						error,
					});
				}
			);
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
		fetch(`/story/transitions/${idStory}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(transitions),
		}).then((response) => {
			history.push("/story/overview");
		});
	};

	return (
		<Container fluid>
			<Row>
				{story.isLoaded ? (
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
				) : (
					<h3>Loading</h3>
				)}
			</Row>
		</Container>
	);
}
export default MissionsTransitions;
