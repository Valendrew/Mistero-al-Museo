import React from 'react';

import Row from 'react-bootstrap/Row';
import Status from './Status';
function PlayerInfo(props) {
	return (
		<>
			<Row>
				<h2>{props.player.value.name}</h2>
			</Row>
			<Status />
		</>
	);
}
export default PlayerInfo;
