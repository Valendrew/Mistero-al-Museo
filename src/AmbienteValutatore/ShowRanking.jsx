import React from 'react';

import { Button, Col } from 'react-bootstrap';

function setVals(props) {
	props.setRanking(true);
	const index = props.stories.findIndex(element => element.info.id === props.storyID);
	props.setStorySelected(index);
}
export default function ShowRanking(props) {
	return (
		<Col>
			<Button onClick={() => setVals(props)}>Show Ranking</Button>
		</Col>
	);
}
