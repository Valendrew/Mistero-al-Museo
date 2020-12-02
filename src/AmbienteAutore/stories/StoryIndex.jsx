import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function StoryPropertyCard(props) {
	return (
		<Card>
			<Card.Header>{props.title}</Card.Header>
			<Card.Body>
				<Form.Control
					value={props.input || ""}
					as={props.as}
					type="text"
					rows="5"
					onChange={(e) => props.onChange(e.target.value, props.inputName)}
				/>
			</Card.Body>
		</Card>
	);
}

function StoryIndex() {
	let history = useHistory();
	const [inputs, setInputs] = useState({
		name: "",
		description: "",
	});
	const [errorInputs, setErrorInputs] = useState();
	
	const onSubmit = (e) => {
		e.preventDefault();
		const stories = {
			name: inputs.name,
			description: inputs.description,
		};
		if (inputs.name.replace(" ", "") === "" || inputs.description.replace(" ", "") === "") {
			setErrorInputs(<p className="text-danger">Compila tutti gli input</p>);
		} else {
			fetch(`/stories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(stories),
			})
				.then((response) => response.json())
				.then((data) => {
					history.push("story/activity", { idStory: data.id, idActivity: 0 });
				})
				.catch(console.log);
		}
	};

	return (
		<Container>
			<Form onSubmit={onSubmit}>
				<StoryPropertyCard
					title={"Nome"}
					inputName={"name"}
					input={inputs.name}
					as={"input"}
					onChange={(value, name) => setInputs({ ...inputs, [name]: value })}
				/>
				<StoryPropertyCard
					title={"Descrizione"}
					inputName={"description"}
					input={inputs.description}
					as={"textarea"}
					onChange={(value, name) => setInputs({ ...inputs, [name]: value })}
				/>
				{errorInputs}
				<Button type="submit" variant="success">
					Prosegui
				</Button>
			</Form>
		</Container>
	);
}

export default StoryIndex;
