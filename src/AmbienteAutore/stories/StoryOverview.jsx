import React, { useEffect, useRef, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import QRCode from "qrcode.react";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const createNodes = (activities, missions) => {
	const nodes = activities
		.map((_, key) => {
			return { id: `a_${key}`, label: `Attività ${key}` };
		})
		.concat(
			Object.keys(missions).map((val) => {
				return { id: `m_${val}`, label: `Missione ${val}` };
			})
		);
	return nodes;
};

const createEdges = (missions, transitions) => {
	let edges = [];
	Object.entries(missions).forEach(([key, value]) => {
		Object.entries(value).forEach(([k, v]) => {
			let newEdge = null;
			if (Array.isArray(v)) {
				v.forEach((act) => {
					if (act === "new_mission") {
						const misTr = transitions.indexOf(key);
						if (misTr + 1 < transitions.length) newEdge = { from: `a_${k}`, to: `m_${transitions[misTr + 1]}` };
					} else newEdge = { from: `a_${k}`, to: `a_${act}` };

					if (newEdge !== null && !edges.some((value) => value.from === newEdge.from && value.to === newEdge.to)) {
						edges.push(newEdge);
					}
				});
			} else {
				newEdge = { from: `m_${key}`, to: `a_${v}` };
				if (!edges.some((value) => value.from === newEdge.from && value.to === newEdge.to)) {
					edges.push(newEdge);
				}
			}
		});
	});
	return edges;
};

function StoryGraph({ story }) {
	const domNode = useRef(null);
	const network = useRef(null);

	useEffect(() => {
		const nodes = new DataSet(createNodes(story.activities, story.missions));
		const edges = new DataSet(createEdges(story.missions, story.transitions));
		const layout = {
			hierarchical: {
				enabled: true,
				direction: "LR",
				sortMethod: "directed",
				levelSeparation: 100,
			},
		};
		const options = {
			autoResize: true,
			height: "100%",
			width: "100%",
			edges: {
				arrows: "to",
			},
			layout: layout,
			interaction: {
				dragNodes: false,
			},
		};

		const data = {
			nodes,
			edges,
		};
		network.current = new Network(domNode.current, data, options);
	}, [story]);

	return (
		<Card>
			<Card.Header>Grafo delle storie</Card.Header>
			<Card.Body>
				<div ref={domNode} />
			</Card.Body>
		</Card>
	);
}

function StoryQRCode(props) {
	return (
		<Card>
			<Card.Header>QRCode</Card.Header>
			{props.value ? (
				<>
					<Card.Body>
						<QRCode value={props.value} />
						<a href={props.value}>Vai alla storia</a>
					</Card.Body>
					<Card.Footer>
						<Button variant="primary" onClick={props.removeQRCode}>
							Ritira
						</Button>
					</Card.Footer>
				</>
			) : (
				<Card.Body>
					<Button variant="primary" onClick={props.generateQRCode}>
						Genera QRCode
					</Button>
				</Card.Body>
			)}
		</Card>
	);
}

function StoryPropertyCard(props) {
	return (
		<Card>
			<Card.Header>{props.title}</Card.Header>
			<Form onSubmit={(e) => props.onSubmit(e, props.inputName)}>
				<Card.Body>
					<Form.Control
						value={props.input || ""}
						as={props.as}
						type="text"
						rows="5"
						onChange={(e) => props.onChange(e.target.value, props.inputName)}
					></Form.Control>
				</Card.Body>
				<Card.Footer>
					<Button variant="primary" type="submit">
						Modifica
					</Button>
				</Card.Footer>
			</Form>
		</Card>
	);
}

function StoryOverview() {
	let history = useHistory();
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const [inputs, setInputs] = useState({
		name: undefined,
		description: undefined,
	});

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/story/${history.location.state.idStory}`, {
				method: "GET",
				headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
			});
			// Se la richiesta non è andata a buon fine
			if (!result.ok) setStory({ isLoaded: true, error: result.statusText });
			else {
				const data = await result.json();
				setStory({
					isLoaded: true,
					items: data,
				});
				setInputs({
					name: data.info.name || "",
					description: data.info.description || "",
				});
			}
		};
		if (!story.isLoaded) fetchData();
	}, [history, story]);

	const onSubmit = (e, type) => {
		e.preventDefault();
		fetch(`/story/${story.items.info.id}/${type}`, {
			method: "PUT",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}`, "Content-Type": "text/plain" },
			body: inputs[type],
		})
			.then((res) => setStory({ error: null, isLoaded: false, items: [] }))
			.catch(console.log);
	};

	const generateQRCode = () => {
		fetch(`/story/${story.items.info.id}/qrcode`, {
			method: "POST",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
		})
			.then((res) => setStory({ error: null, isLoaded: false, items: [] }))
			.catch(console.log);
	};

	const removeQRCode = () => {
		fetch(`/story/${story.items.info.id}/qrcode`, {
			method: "DELETE",
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
		})
			.then((res) => setStory({ error: null, isLoaded: false, items: [] }))
			.catch(console.log);
	};

	return (
		<Container>
			<Navbar>
				<Nav>
					<Nav.Link as={Link} to="/autore">
						Ambiente valutatore
					</Nav.Link>
				</Nav>
			</Navbar>
			{story.isLoaded ? (
				story.error ? (
					<h5>Errore nel caricamento, ricaricare</h5>
				) : (
					<>
						<StoryPropertyCard
							title={"Nome"}
							inputName={"name"}
							input={inputs.name}
							as={"input"}
							onSubmit={onSubmit}
							onChange={(value, name) => setInputs({ ...inputs, [name]: value })}
						/>
						<StoryPropertyCard
							title={"Descrizione"}
							inputName={"description"}
							input={inputs.description}
							as={"textarea"}
							onSubmit={onSubmit}
							onChange={(value, name) => setInputs({ ...inputs, [name]: value })}
						/>
						<StoryQRCode value={story.items.info.qr} removeQRCode={removeQRCode} generateQRCode={generateQRCode} />
						<StoryGraph story={story.items} />
					</>
				)
			) : (
				<h5>Loading...</h5>
			)}
		</Container>
	);
}

export default StoryOverview;
