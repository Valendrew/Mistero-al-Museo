import React from 'react';

import { Button } from 'react-bootstrap';


export default function ShowRanking(props) {
	
	return (
        <Button onClick={()=>props.setRanking(true)}>Show Ranking</Button>
	);
}
