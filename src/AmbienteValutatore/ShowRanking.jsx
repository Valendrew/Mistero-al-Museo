import React from 'react';

import { Button } from 'react-bootstrap';


export default function ExportData(props) {
	
	return (
        <Button onClick={()=>props.setRanking(true)}>Show Ranking</Button>
	);
}
