import React, { useState, useEffect } from "react";
import { Container, ListGroup, ListGroupItem, Tab, Button, Collapse } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router-dom";
function PlayerList(props) {
	const idStory = props.id;
	const [players, setPlayers] = useState({ error: null, isLoaded: false, items: {} });
	useEffect(() => {

		const fetchData = async () => {
			const result = await fetch(`/games/${idStory}/players`, {
				method: "GET",
			});
			if (!result.ok) setPlayers({ isLoaded: true, error: result.statusText });
			else {
				result.json().then((data) => setPlayers({ isLoaded: true, items: data }));
			}
		};
		fetchData();
	}, []);
	return (
			<ListGroup variant="flush">
				{
					Object.entries(players.items).map(([key, value]) => {
						return (
							<ListGroupItem action onClick={()=>props.setPlayer(key,value)}><h6>{value.name}</h6>{key}</ListGroupItem>
						);
					})
				}
			</ListGroup>
	)
}
function ListStories(props) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="light" block onClick={() => setOpen(!open)}>
				{props.name}
			</Button>
			<Collapse in={open}>
				<div>
					<PlayerList id={props.id} setPlayer={props.setPlayer} />
				</div>
				
			</Collapse>
		</>
	)
}

function SideBar(props) {
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		fetch(`/stories`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => res.json())
			.then(
				(result) => {
					setStories({
						isLoaded: true,
						items: result,
					});
				},
				(error) => {
					setStories({
						isLoaded: true,
						error,
					});
				}
			);
	}, []);
	return (
		<ListGroup>
			{stories.items.map((value) => {
				return (
					<ListStories id={value.info.id} name={value.info.name} setPlayer={props.setPlayer}/>
				);
			})
			}
		</ListGroup>
	);

}
export default SideBar;