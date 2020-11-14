import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

export default function DropDownInputs(props) {
	return (
		<DropdownButton title="Aggiungi Input" drop="right">
			{props.allowedInputs.map((val, key) => {
				return (
					<Dropdown.Item
						key={key}
						onClick={() => props.handleAddInput(val.id, props.category)}>
						{val.value}
					</Dropdown.Item>
				);
			})}
		</DropdownButton>
	);
}
