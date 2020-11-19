import React from 'react';

import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Status from './Status';
function PlayerInfo(props) {
	return (
		<Container fluid>
			<Row>
				<Col xs={6}>
					<Status {...props} />
				</Col>
			</Row>
		</Container>
	);
}
export default PlayerInfo;
