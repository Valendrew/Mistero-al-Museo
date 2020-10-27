import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function UserCard() {
	return (
		<Card>
			<Card.Header>Giocatori in partita</Card.Header>
			<Card.Body></Card.Body>
		</Card>
	);
}
function Valutatore() {
	const [heading, setHeading] = useState("");
	const fetching = async () => {
		const res = await fetch("/games/1/help", {
			headers: { Authorization: `Basic ${btoa("user_1:abcd")}` },
		});
		if (!res.ok) {
			console.log("errore " + res.statusText);
			fetching();
		} else {
			res.text().then((data) => {
				setHeading(data);
				fetching();
			});
		}
	};
	fetching();
	return (
		<Container>
			<h1>Ambiente valutatore</h1>
			<UserCard />
			<h6>{heading}</h6>
		</Container>
	);
}

export default Valutatore;
