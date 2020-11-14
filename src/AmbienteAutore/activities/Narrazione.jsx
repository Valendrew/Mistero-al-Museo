import React from "react";
import InputScritto from "./InputScritto";
import InputMedia from "./InputMedia";
import RemoveButton from "./RemoveButton";
import DropdownInputs from "./DropdownInputs";
import { Row, Col } from "react-bootstrap";

export default function Narrazione(props) {
	return (
		<>
			<Row>
				<Col>
					<h4>Narrazione</h4>
				</Col>
				<Col>
					<DropdownInputs
						allowedInputs={props.storylineInputs}
						handleAddInput={props.handleAddInput}
						category={"storyline"}
					/>
				</Col>
			</Row>
			{Object.entries(props.storyline).map(([key, val]) => {
				return (
					<Row key={key}>
						<Col sm={1}>
							<RemoveButton
								category={"storyline"}
								id={key}
								handleRemoveInput={props.handleRemoveInput}
							/>
						</Col>
						<Col>
							{props.inputs[key].type === "text" ? (
								<InputScritto
									id={key}
									type={props.inputs[key].type}
									value={props.inputs[key].value}
									handleInput={props.handleInput}
								/>
							) : props.inputs[key].type === "img" ? (
								<InputMedia
									id={key}
									type={props.inputs[key].type}
									altId={val.alt}
									altValue={props.inputs[val.alt].value}
									ext="image/*"
									handleInput={props.handleInput}
								/>
							) : (
								<InputMedia
									id={key}
									type={props.inputs[key].type}
									ext="video/*"
									handleInput={props.handleAddInput}
								/>
							)}
						</Col>
					</Row>
				);
			})}
		</>
	);
}
