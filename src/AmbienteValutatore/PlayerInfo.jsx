import React from 'react';

import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';

import Status from './Status';
import PlayerAnswer from './PlayerAnswer';
import Chat from './Chat';
import Help from './Help';

function PlayerInfo(props) {
	return (
		<>
			<Row style={{ height: '50%', paddingBottom: '1vh' }}>
				<Col xs={6}>
					<Status {...props} />
				</Col>
				<Col xs={6}>
					<Chat {...props} />
				</Col>
			</Row>
			<Row style={{ height: '50%' }}>
				<Col xs={6}>
					<Help {...props} />
				</Col>

				<Col xs={6}>
					<PlayerAnswer {...props} />
				</Col>
			</Row>
		</>
	);
}
export default PlayerInfo;
