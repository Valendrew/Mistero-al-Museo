import React from "react";

import Row from "react-bootstrap/Row";
function PlayerInfo(props) {
	return (
		<Row>
			<h2>{props.player.value.name}</h2>
		</Row>
	);
}
export default PlayerInfo;
