import React, { useState } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";

export default function InputMedia(props) {
	const [mediaUrl, setMediaUrl] = useState(undefined);

	function handleUpload(e) {
		const fileUploaded = e.target.files[0];
		setMediaUrl(URL.createObjectURL(fileUploaded));
		props.handleInput(fileUploaded, props.id);
	}
	return (
		<>
			<Row className="mt-2 mr-2">
				<Col xs={6}>
					<Form.File name={props.id} accept={props.ext} onChange={handleUpload} />
				</Col>
				<Col xs={6}>
					{mediaUrl ? (
						props.type === "img" ? (
							<Image src={mediaUrl} thumbnail fluid />
						) : (
							<video alt="video_uploaded" controls width="250px">
								<source src={mediaUrl} type="video/mp4" />
							</video>
						)
					) : null}
				</Col>
			</Row>

			{props.type === "img" ? (
				<Row className="mt-2 mr-2">
					<Col>
						<Form.Label>Inserisci descrizione del testo</Form.Label>
					</Col>
					<Col>
						<Form.Control
							required
							as="textarea"
							name={props.altId}
							value={props.altValue}
							onChange={(e) => props.handleInput(e.target.value, props.altId)}
						/>
					</Col>
				</Row>
			) : null}
		</>
	);
}
