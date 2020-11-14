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
		<Form onSubmit={(e) => props.handleSubmit(e, props.index)}>
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

function TransitionsListGroup(props) {
	return (
		<Col>
			<ListGroup variant="flush">
				<h6>Transizione {props.index}</h6>
				{props.transition.map((val) => {
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
function MissionsTransitions() {
	let history = useHistory();
	const idStory = history.location.state.id;

	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const [missions, setMissions] = useState([]);
	const [transitions, setTransitions] = useState([[]]);
	const [input, setInput] = useState();

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/stories/${idStory}/missions`, {
				method: "GET",
			});
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({ isLoaded: true, items: data });
				setMissions(Object.keys(data));
			}
		};
		fetchData();
	}, [idStory]);

	useEffect(() => {
		setInput(missions.length ? missions[0] : "");
	}, [missions]);

	const handleSubmit = (e, index) => {
		e.preventDefault();
		let newTransitions = [...transitions];
		let newTransition = [...newTransitions[index], input];
		newTransitions[index] = newTransition;
		setTransitions(newTransitions);
		setMissions(missions.filter((val) => input !== val));
	};

	const handleSelect = (e) => {
		setInput(e.target.value);
	};

	const resetMissions = (e) => {
		e.preventDefault();
		setMissions(Object.keys(story.items));
		setTransitions(transitions.concat([[]]));
	};

	const createStory = () => {
		fetch(`/stories/${idStory}/transitions`, {
			method: "POST",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "application/json" },
			body: JSON.stringify(transitions),
		})
			.then((response) => {
				history.push(`overview`, { id: idStory });
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
						<Row>
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
										<Button variant="primary" onClick={createStory}>
											Crea storia
										</Button>
										<Button variant="primary" onClick={resetMissions}>
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
