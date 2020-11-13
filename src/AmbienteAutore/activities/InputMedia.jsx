import React, { useState } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";

export default function InputMedias(props) {
	const [mediaUrl, setMediaUrl] = useState(undefined);

	function handleUpload(e) {
		const fileUploaded = e.target.files[0];
		setMediaUrl(URL.createObjectURL(fileUploaded));
		props.handleInput(fileUploaded, props.id);
	}
	return (
		<Row>
			<Col>
				<Form.File name={props.id} accept={props.ext} onChange={handleUpload} />
			</Col>
			<Col>
				{mediaUrl ? (
					props.type === "img" ? (
						<Image src={mediaUrl} thumbnail fluid />
					) : (
						<video alt="" width="320" height="240" controls>
							<source src={mediaUrl}></source>
						</video>
					)
				) : null}
			</Col>
			<Col>
				{props.type === "img" ? (
					<Form.Control
						as="textarea"
						name={props.altId}
						value={props.altValue}
						onChange={(e) => props.handleInput(e.target.value, props.altId)}
					/>
				) : null}
			</Col>
		</Row>
	);
}
