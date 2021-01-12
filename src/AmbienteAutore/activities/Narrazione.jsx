import React from 'react';
import InputScritto from './InputScritto';
import InputMedia from './InputMedia';
import RemoveButton from './RemoveButton';
import DropdownInputs from './DropdownInputs';
import { Row, Col, Card, Tab, ListGroup } from 'react-bootstrap';

export default function Narrazione(props) {
	const inputsAsArray = Object.entries(props.storyline);
	return (
		<Card bg='light'>
			<Card.Header>
				<Row>
					<Col>
						<h4>Narrazione</h4>
					</Col>
					<Col xs={6} md={4} lg={2}>
						<DropdownInputs
							allowedInputs={props.storylineInputs}
							handleAddInput={props.handleAddInput}
							category={'storyline'}
						/>
					</Col>
				</Row>
			</Card.Header>
			{inputsAsArray.length ? (
				<Tab.Container id='narrazione' defaultActiveKey={inputsAsArray[0][0]}>
					<Row>
						<Col xs={3} style={{ height: '30vh', overflowY: 'scroll' }}>
							<ListGroup className='overflow-scroll'>
								{inputsAsArray.map(([key, val]) => (
									<ListGroup.Item key={key} className='text-dark d-md-flex justify-content-md-between' eventKey={key}>
										{props.inputs[key].type === 'text'
											? props.storylineInputs[0].value
											: props.inputs[key].type === 'img'
											? props.storylineInputs[1].value
											: props.storylineInputs[2].value}
										<RemoveButton category={'storyline'} id={key} handleRemoveInput={props.handleRemoveInput} />
									</ListGroup.Item>
								))}
							</ListGroup>
						</Col>
						<Col xs={9}>
							<Tab.Content>
								{inputsAsArray.map(([key, val]) => (
									<Tab.Pane eventKey={key} key={key} style={{ height: '30vh', overflowY: 'auto' }}>
										{props.inputs[key].type === 'text' ? (
											<InputScritto
												id={key}
												type={props.inputs[key].type}
												value={props.inputs[key].value}
												handleInput={props.handleInput}
											/>
										) : props.inputs[key].type === 'img' ? (
											<InputMedia
												id={key}
												value={props.inputs[key].value}
												type={props.inputs[key].type}
												altId={val.alt}
												altValue={props.inputs[val.alt].value}
												ext='image/*'
												handleInput={props.handleInput}
											/>
										) : (
											<InputMedia id={key} type={props.inputs[key].type} ext='.mp4' handleInput={props.handleInput} />
										)}
									</Tab.Pane>
								))}
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			) : null}
		</Card>
	);
}
