import React from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";

function TipListItem(props) {
	return (
		<ListGroup.Item>
			<Form.Label>Inserisci l'aiuto numero {props.index}: </Form.Label>
			<Form.Control
				type="text"
				name={props.id}
				value={props.value}
				onChange={(e) => props.handleInput(e.target.value, props.id)}
			/>
		</ListGroup.Item>
	);
}
export default function Tips(props) {
	return (
		<>
			<Row>
				<Col className="my-2">
					<Form.Control
						name={props.rangeId}
						value={props.inputs[props.rangeId].value}
						type="number"
						min="0"
						max="5"
						onChange={(e) =>
							props.handleInput(
								e.target.value,
								props.rangeId,
								props.questionId,
								"tips"
							)
						}></Form.Control>
				</Col>
			</Row>
			<ListGroup>
				{Object.entries(props.tips).map(([key, val]) => {
					return (
						<TipListItem
							key={key}
							handleInput={props.handleInput}
							index={key}
							id={val}
							value={props.inputs[val].value}
						/>
					);
				})}
			</ListGroup>
		</>
	);
}
