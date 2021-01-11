import React from 'react';

import { Button } from 'react-bootstrap';

function setVals(props){
	props.setRanking(true);
	const index = props.stories.findIndex(element => element.info.id === props.storyID);
	props.setStorySelected(index);
}
export default function ShowRanking(props) {
	
	return (
        <Button onClick={()=>setVals(props)}>Show Ranking</Button>
	);
}
