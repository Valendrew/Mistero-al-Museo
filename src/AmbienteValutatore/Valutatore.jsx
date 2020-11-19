import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SideBar from "./SideBar";
import PlayerInfo from "./PlayerInfo";

function Valutatore() {
	const [player, setPlayer] = useState({ id: "", value: {} });

	const passPlayer = (id, value) => {
		setPlayer({
			value: value,
			id: id,
		});
	};
	return (
		<Row>
			<Col xs={4} lg={3}>
				<SideBar setPlayer={passPlayer} />
			</Col>
			<Col xs={8} lg={9}>
				<PlayerInfo player={player} />
			</Col>
		</Row>
	);
}
export default Valutatore;
