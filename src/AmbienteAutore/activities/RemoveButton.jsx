import React from "react";
import { Button } from "react-bootstrap";

export default function RemoveButton(props) {
	return (
		<Button
			type="button"
			variant="danger"
			onClick={() => props.handleRemoveInput(props.id, props.category)}>
			X
		</Button>
	);
}
