import React, { useState } from 'react';

import { Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

function RankingTable(props) {
	const playerSorted = Object.entries(props.players[0]).sort(
		([key, val], [key_2, val_2]) => val_2.status.score - val.status.score
	);
	return props.players
		? playerSorted.map(([key, val], index) => {
				return index == 0 ? (
					<tr style={{ backgroundColor: 'goldenrod' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				) : index == 1 ? (
					<tr style={{ backgroundColor: 'silver' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				) : index == 2 ? (
					<tr style={{ backgroundColor: 'rgb(205,127,50)' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				) : (
					<tr style={{ backgroundColor: 'trasparent' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				);
		  })
		: null;
}

function Ranking(props) {
	return (
		<Col xs={6}>
			<Table bordered>
				<thead>
					<tr>
						<th>Nome</th>
						<th>Punteggio</th>
					</tr>
				</thead>
				<tbody>
					<RankingTable {...props} />
				</tbody>
			</Table>
		</Col>
	);
}
export default Ranking;
