import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image';

function TextParagraph(props) {
	return <p className={props.style.paragrafo}>{props.text[1]}</p>;
}

function Media(props) {
	const [mediaURL, setMediaURL] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	useEffect(() => {
		const fetchMedia = () => {
			fetch(`/files/${props.value[1]}.${props.value[2]}`)
				.then(result => result.blob())
				.then(data => {
					const objectURL = URL.createObjectURL(data);
					setMediaURL(objectURL);
					setIsLoaded({ loaded: true });
				})
				.catch(e => console.log(e));
		};
		if (!isLoaded.loaded) fetchMedia();
	}, [isLoaded, props.value]);

	return isLoaded.loaded ? (
		isLoaded.error ? (
			<p>Immagine: {props.value[2]}</p>
		) : props.value[0] === 'img' ? (
			<div className={props.style.backMedia}>
				<Image width='200px' src={mediaURL} thumbnail fluid className={props.style.immagine} />
			</div>
		) : (
			<div className={props.style.backMedia}>
				<video alt='' width='320' height='240' controls>
					<source src={mediaURL}></source>
				</video>
			</div>
		)
	) : (
		'Loading...'
	);
}

function Storyline(props) {
	return (
		<div>
			{props.storyline[0] === 'text' ? (
				<TextParagraph text={props.storyline} style={props.style} />
			) : (
				<Media value={props.storyline} style={props.style} />
			)}
			<hr />
		</div>
	);
}

export default Storyline;
