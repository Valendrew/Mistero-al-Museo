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
			<Row className='p-4' style={{ height: '50vh' }}>
				<Col xs={6}>
					<Status {...props} />
				</Col>
				<Col xs={6}>
					<Chat {...props} />
				</Col>
			</Row>
			<Row className='p-4' style={{ height: '50vh' }}>
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
