import React from "react";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function MissionModal(props) {
	const componentName = "missionModal";
	return (
		<Modal show={props.showModal} onHide={props.handleHide} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>Aggiungi missione</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Control as="select" name={componentName} value={props.value || ''} onChange={(e) => props.handleSelect(e)}>
						{props.activities.map((value, key) => {
							return <option key={`attività_${key}`} value={value}>Attività {value}</option>;
						})}
					</Form.Control>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={(e) => props.handleAddActivity(componentName, e)}>
					Aggiungi
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default MissionModal;
