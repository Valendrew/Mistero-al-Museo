import React from "react";
import { Form, Col, Row } from "react-bootstrap";

export default function RispostaMultipla(props) {
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
							props.handleInput(e.target.value, props.rangeId, props.questionId, "answers")
						}></Form.Control>
				</Col>
			</Row>
			<Row>
				<Col className="my-2">
					<Row>
						<Col>Inserisci risposta</Col>
						<Col>Selezione le questions corrette</Col>
						<Col>Genera percorso alternativo</Col>
						<Col>Inserisci punteggio</Col>
					</Row>
					{Object.entries(props.answers).map(([key, val]) => {
						return (
							<Row key={key}>
								<Col>
									<Form.Control
										name={val[0]}
										value={props.inputs[val[0]].value}
										type="text"
										onChange={(e) =>
											props.handleInput(e.target.value, e.target.name)
										}
									/>
								</Col>
								<Col>
									<Form.Check
										name={val[1]}
										value={props.inputs[val[1]].value}
										type="checkbox"
										onChange={(e) =>
											props.handleInput(e.target.checked, e.target.name)
										}
									/>
								</Col>
								<Col>
									<Form.Check
										name={val[2]}
										value={props.inputs[val[2]].value}
										type="checkbox"
										onChange={(e) =>
											props.handleInput(e.target.checked, e.target.name)
										}
									/>
								</Col>
								<Col>
									<Form.Control
										name={val[3]}
										value={props.inputs[val[3]].value}
										type="number"
										min="-50"
										max="50"
										onChange={(e) =>
											props.handleInput(e.target.value, e.target.name)
										}
									/>
								</Col>
							</Row>
						);
					})}
				</Col>
			</Row>
		</>
	);
}
