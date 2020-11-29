import React from 'react';

import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Status from './Status';
import PlayerAnswer from './PlayerAnswer';
import Chat from './Chat';
import Help from './Help';

function PlayerInfo(props) {
	return (
		<Container fluid>
			<Row>
				<Col xs={6}>
					<Status {...props} />
				</Col>
				<Col xs={6}>
					<Help {...props} />
				</Col>
				{/* <Col>
                    <Chat chat={props.status.chat} {...props}/>
                </Col> */}
			</Row>
			<Row>
				<Col xs={12}>
					<PlayerAnswer {...props} />
				</Col>
			</Row>
		</Container>
	);
}
export default PlayerInfo;
