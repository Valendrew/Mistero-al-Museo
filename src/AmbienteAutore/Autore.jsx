import React, { useState, useEffect } from 'react';

import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumb } from 'react-bootstrap';

import MissionsOverview from './missions/MissionsOverview';
import StoryOverview from './stories/StoryOverview';
import Activity from './activities/Activity';
import StoryIndex from './stories/StoryIndex';
import NavbarAutore from './NavbarAutore';
import ActivityOverview from './activities/ActivityOverview';
import StoryConclusion from './stories/StoryConclusion';

function StoryCard(props) {
	return (
		<Card>
			<Card.Header>
				{props.title}{' '}
				{props.archived ? (
					<>
						- <Button onClick={() => props.enableStory(props.id)}>Riattiva storia</Button>
					</>
				) : null}
			</Card.Header>
			<Card.Body>
				<Card.Text>{props.description}</Card.Text>
				{props.archived ? null : (
					<Button variant='primary' onClick={() => props.onEditStory(props.id)}>
						Modifica storia
					</Button>
				)}
			</Card.Body>
		</Card>
	);
}

function AutoreHome(props) {
	const match = useRouteMatch('/autore');
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });

	useEffect(() => {
		if (!stories.isLoaded) {
			fetch(`/stories`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
				.then(res => res.json())
				.then(
					result => {
						setStories({
							isLoaded: true,
							items: result
						});
					},
					error => {
						setStories({
							isLoaded: true,
							error
						});
					}
				);
		}
	}, [stories]);

	const enableStory = id => {
		fetch(`/stories/${id}/archived`, {
			method: 'POST'
		})
			.then(res => setStories({ error: null, isLoaded: false, items: [] }))
			.catch(console.log);
	};

	return (
		<Container>
			<Breadcrumb>
				<LinkContainer to='/'>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
				</LinkContainer>

				<LinkContainer active to='/autore'>
					<Breadcrumb.Item>Autore</Breadcrumb.Item>
				</LinkContainer>
				<LinkContainer to={`${match.url}/story`}>
					<Breadcrumb.Item>Crea nuova storia</Breadcrumb.Item>
				</LinkContainer>
			</Breadcrumb>
			<Row>
				{stories.isLoaded ? (
					stories.error ? (
						<h5>Nessuna storia presente</h5>
					) : (
						stories.items.map(value => {
							return (
								<Col lg='4' key={value.info.id}>
									<StoryCard
										id={value.info.id}
										title={value.info.name}
										description={value.info.description}
										archived={value.info.archived}
										enableStory={enableStory}
										{...props}
									/>
								</Col>
							);
						})
					)
				) : (
					<h5>Loading</h5>
				)}
			</Row>
		</Container>
	);
}
function Autore() {
	const match = useRouteMatch('/autore');
	let history = useHistory();

	const onEditStory = idStory => {
		history.push(`${match.path}/story/overview`, { idStory: idStory });
	};

	return (
		<Switch>
			<Route exact path='/autore'>
				<AutoreHome onEditStory={onEditStory} />
			</Route>
			<Route exact path={`${match.path}/story`}>
				<Container>
					<NavbarAutore name='Creazione storia' />
					<StoryIndex />
				</Container>
			</Route>
			<Route exact path={`${match.path}/story/overview`}>
				<Container>
					<NavbarAutore name='Riassunto storia' />
					<StoryOverview />
				</Container>
			</Route>
			<Route path={`${match.path}/story/activities`}>
				<Container>
					<NavbarAutore name='Riassunto attività' />
					<ActivityOverview />
				</Container>
			</Route>
			<Route path={`${match.path}/story/missions`}>
				<Container>
					<NavbarAutore name='Crea missione' />
					<MissionsOverview />
				</Container>
			</Route>
			<Route path={`${match.path}/story/conclusion`}>
				<Container>
					<NavbarAutore name='Conclusione storia' />
					<StoryConclusion />
				</Container>
			</Route>
			<Route path={`${match.path}/story/activity`}>
				<Container>
					<NavbarAutore name='Crea attività' />
					<Activity />
				</Container>
			</Route>
		</Switch>
	);
}

export default Autore;
