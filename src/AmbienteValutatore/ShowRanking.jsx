import React from 'react';

import { Button, Table, Row, Col } from 'react-bootstrap';


export default function ExportData(props) {
	
	return (
        <Button onClick={()=>props.setRanking(true)}>Show Ranking</Button>
	);
}
