import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function TextParagraph({ text }) {
	return <p>{text[1]}</p>;
}

function Media({ value }) {
	const [mediaURL, setMediaURL] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	useEffect(() => {
		const fetchMedia = () => {
			fetch(`/files/${value[1]}.${value[2]}`)
				.then((result) => result.blob())
				.then((data) => {
					const objectURL = URL.createObjectURL(data);
					setMediaURL(objectURL);
					setIsLoaded({ loaded: true });
				})
				.catch((e) => console.log(e));
		};
		if (!isLoaded.loaded) fetchMedia();
	}, [isLoaded, value]);

	return isLoaded.loaded ? (
		isLoaded.error ? (
			<p>Immagine: {value[2]}</p>
		) : value[0] === "img" ? (
			<div class="backImg">
				<Image width="200px" src={mediaURL} thumbnail fluid />
			</div>
		) : (
			<video alt="" width="320" height="240" controls>
				<source src={mediaURL}></source>
			</video>
		)
	) : (
		"Loading..."
	);
}

function Storyline({ storyline }) {
	return (
		<Container fluid>
			{storyline.map((value, key) => {
				return (
					<Row key={key}>
						{value[0] === "text" ? <TextParagraph text={value} /> : <Media value={value} />}
						<hr />
					</Row>
				);
			})}
		</Container>
	);
}

export default Storyline;
