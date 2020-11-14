import React from "react";
import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function TextParagraph({ text }) {
	return <p>{text[1]}</p>;
}

function Media({ value }) {
	/* const [mediaURL, setMediaURL] = useState(undefined);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (!mediaURL) {
			if (value[0] === "img" || value[0] === "video") {
				fetch(`/files/${idStory}/${value[1]}.${value[2]}`)
					.then((result) => result.blob())
					.then((data) => {
						var objectURL = URL.createObjectURL(data);
						setMediaURL(objectURL);
						setIsLoaded(true);
					})
					.catch((e) => console.log(e));
			} else setIsLoaded(true);
		}
	}, [mediaURL, idStory, value]);

	return isLoaded ? (
		<>
			{img[0]} :
			{img[0] === "img" ? (
				<Image src={mediaURL} thumbnail fluid />
			) : img[0] === "video" ? (
				<video alt="" width="320" height="240" controls>
					<source src={mediaURL}></source>
				</video>
			) : (
				img[1]
			)}
		</>
	) : (
		"Loading..."
    ); */
	return <h5>Image</h5>;
}

function Storyline(props) {
	return (
		<Container>
			{props.storyline.map((value, key) => {
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
