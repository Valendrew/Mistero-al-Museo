import React from 'react';

import { Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

function RankingTable(props) {
	console.log(props.players);
	const playerSorted = Object.entries(props.players[props.storySelected]).sort(
		([key, val], [key_2, val_2]) => val_2.status.score - val.status.score
	);
	return props.players
		? playerSorted.map(([key, val], index) => {
				return index === 0 ? (
					<tr style={{ backgroundColor: 'goldenrod' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				) : index === 1 ? (
					<tr style={{ backgroundColor: 'silver' }}>
						<td>{val.name}</td>
						<td>{val.status.score}</td>
					</tr>
				) : index === 2 ? (
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
		<Table bordered className="my-4">
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
	);
}
export default Ranking;
