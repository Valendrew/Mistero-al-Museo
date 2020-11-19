import React from 'react';

import RispostaMultipla from './RispostaMultipla';
import RispostaAperta from './RispostaAperta';
import InputDomanda from './InputDomanda';
import RemoveButton from './RemoveButton';
import DropdownInputs from './DropdownInputs';
import Tips from './Tips';

import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';

export default function Risposta(props) {
	const questionsArray = Object.entries(props.questions);
	return (
		<Card bg={'light'}>
			<Card.Header>
				<Row>
					<Col>
						<h4>Risposta</h4>
					</Col>
					{questionsArray.length === 0 ? (
						<Col xs={6} md={4} lg={2}>
							<DropdownInputs
								allowedInputs={props.questionsInputs}
								handleAddInput={props.handleAddInput}
								category={'questions'}
							/>
						</Col>
					) : (
						<Col xs={2} sm={1}>
							<RemoveButton
								id={Object.entries(props.questions)[0][0]}
								category={'questions'}
								handleRemoveInput={props.handleRemoveInput}
							/>
						</Col>
					)}
				</Row>
			</Card.Header>

			{questionsArray.map(([key, val]) => {
				return (
					<Card.Body key={key}>
						<InputDomanda id={key} value={props.inputs[key].value} handleInput={props.handleInput} />
						<Tabs defaultActiveKey='answers'>
							<Tab eventKey='answers' title='Risposte'>
								{props.inputs[key].type === 'open' ? (
									<RispostaAperta
										minId={val.minScore}
										maxId={val.maxScore}
										minValue={props.inputs[val.minScore].value}
										maxValue={props.inputs[val.maxScore].value}
										handleInput={props.handleInput}
									/>
								) : props.inputs[key].type === 'widget' ? null : (
									<RispostaMultipla
										questionId={key}
										rangeId={val.answersRange}
										answers={val.answers}
										inputs={props.inputs}
										handleInput={props.handleInput}
									/>
								)}
							</Tab>
							<Tab eventKey='tips' title='Suggerimenti'>
								<Tips
									questionId={key}
									rangeId={val.tipsRange}
									tips={val.tips}
									inputs={props.inputs}
									handleInput={props.handleInput}
								/>
							</Tab>
						</Tabs>
					</Card.Body>
				);
			})}
		</Card>
	);
}
