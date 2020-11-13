import React from "react";

import RispostaMultipla from "./RispostaMultipla";
import RispostaAperta from "./RispostaAperta";
import InputDomanda from "./InputDomanda";
import RemoveButton from "./RemoveButton";
import DropdownInputs from "./DropdownInputs";
import Tips from "./Tips";

import { Container, Row, Col } from "react-bootstrap";

export default function Risposta(props) {
	return (
		<>
			<Row>
				<Col>
					<h4>Risposta</h4>
				</Col>
				<Col>
					<DropdownInputs
						allowedInputs={props.questionsInputs}
						handleAddInput={props.handleAddInput}
						category={"questions"}
					/>
				</Col>
			</Row>
			{Object.entries(props.questions).map(([key, val]) => {
				return (
					<Container key={key}>
						<Row>
							<Col>
								<RemoveButton
									id={key}
									category={"questions"}
									handleRemoveInput={props.handleRemoveInput}
								/>
							</Col>
							<Col>
								<InputDomanda
									id={key}
									value={props.inputs[key].value}
									handleInput={props.handleInput}
								/>
							</Col>
						</Row>
						<Row>
							{props.inputs[key].type === "open" ? (
								<RispostaAperta
									minId={val.minScore}
									maxId={val.maxScore}
									minValue={props.inputs[val.minScore].value}
									maxValue={props.inputs[val.maxScore].value}
									handleInput={props.handleInput}
								/>
							) : props.inputs[key].type === "widget" ? null : (
								<RispostaMultipla
									questionId={key}
									rangeId={val.answersRange}
									answers={val.answers}
									inputs={props.inputs}
									handleInput={props.handleInput}
								/>
							)}
						</Row>
						<Row>
							<Tips
								questionId={key}
								rangeId={val.tipsRange}
								tips={val.tips}
								inputs={props.inputs}
								handleInput={props.handleInput}
							/>
						</Row>
					</Container>
				);
			})}
		</>
	);
}
