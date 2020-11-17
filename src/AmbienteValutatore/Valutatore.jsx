import React, { useState, useEffect } from "react";

import { Switch, Route, Link, useRouteMatch, useHistory } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SideBar from './SideBar'
import PlayerInfo from './PlayerInfo'



function Valutatore() {
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });
	const [player, setPlayer] = useState({ id: "", value: {} });

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
	const passPlayer=(id_, value_)=>{
		setPlayer({
			value:value_,
			id:id_
		})

	}
	return (
		<>
			<h1>Ambiente Valutatore</h1>
			<Row>
				<Col lg={3}>
					<SideBar setPlayer={passPlayer}/>
				</Col>
				<Col lg={9}>
					<PlayerInfo player={player}/>
				</Col>
			</Row>

		</>
	);

}
export default Valutatore;