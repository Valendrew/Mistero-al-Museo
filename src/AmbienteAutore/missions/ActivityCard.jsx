import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

function ActivityListItem({ value }) {
	const [mediaURL, setMediaURL] = useState(undefined);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (!mediaURL) {
			if (value[0] === 'img' || value[0] === 'video') {
				fetch(`/files/${value[1]}.${value[2]}`)
					.then(result => result.blob())
					.then(data => {
						var objectURL = URL.createObjectURL(data);
						setMediaURL(objectURL);
						setIsLoaded(true);
					})
					.catch(e => console.log(e));
			} else setIsLoaded(true);
		}
	}, [mediaURL, value]);
	return (
		<ListGroup.Item>
			{isLoaded ? (
				<>
					{value[0] === 'img' ? (
						<Image src={mediaURL} thumbnail fluid />
					) : value[0] === 'video' ? (
						<video alt='' width='320' height='240' controls>
							<source src={mediaURL}></source>
						</video>
					) : (
						value[1]
					)}
				</>
			) : (
				'Loading...'
			)}
		</ListGroup.Item>
	);
}
function ActivityList(props) {
	return (
		<ListGroup variant='flush'>
			{props.storyline.map((value, key) => (
				<ActivityListItem key={key} value={value} />
			))}
		</ListGroup>
	);
}

function QuestionList(props) {
	return (
		<ListGroup variant='flush'>
			<ListGroup.Item>
				Domanda di tipologia <span style={{ textDecoration: 'underline' }}>{props.question.type}</span>:{' '}
				{props.question.value}
			</ListGroup.Item>
		</ListGroup>
	);
}

function ActivityCard(props) {
	let question;
	if (props.questions.length) {
		question = props.questions[0];
	}
	return (
		<Col className='my-2' style={props.style}>
			<Card style={{ height: props.height || '50vh' }}>
				<Card.Header>Attività {props.id.toString()}</Card.Header>
				<Card.Body style={{ heigth: '50%', overflowY: 'auto' }}>
					<Card.Title>Elementi narrazione</Card.Title>
					<ActivityList {...props} />
					{question ? (
						<>
							<Card.Title>Domanda e risposte</Card.Title>
							<QuestionList question={question} />
						</>
					) : null}
				</Card.Body>
			</Card>
		</Col>
	);
}

export default ActivityCard;
