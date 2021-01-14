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
		<Col className={`mb-4 ${props.archived ? 'order-last' : null}`}>
			<Card style={{ height: '25vh' }}>
				<Card.Header>{props.title}</Card.Header>
				<Card.Body style={{ overflowY: 'auto' }}>
					<Card.Text>{props.description}</Card.Text>
				</Card.Body>
				<Card.Footer>
					{props.archived ? (
						<Button variant="info" onClick={() => props.enableStory(props.id)}>Riattiva storia</Button>
					) : (
						<Button onClick={() => props.onEditStory(props.id)}>Modifica storia</Button>
					)}
				</Card.Footer>
			</Card>
		</Col>
	);
}

function AutoreHome(props) {
	const match = useRouteMatch('/autore');
	

	useEffect(() => {
		if (!props.stories.isLoaded) {
			fetch(`/stories`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
				.then(res => res.json())
				.then(
					result => {
						props.setStories({
							isLoaded: true,
							items: result
						});
					},
					error => {
						props.setStories({
							isLoaded: true,
							error
						});
					}
				);
		}
	}, [props]);

	const enableStory = id => {
		fetch(`/stories/${id}/archived`, {
			method: 'POST'
		})
			.then(res => props.setStories({ error: null, isLoaded: false, items: [] }))
			.catch(console.log);
	};

	return (
		<Container fluid>
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
			<Row className='row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4'>
				{props.stories.isLoaded ? (
					props.stories.error ? (
						<h5>Nessuna storia presente</h5>
					) : (
						props.stories.items.map(value => {
							return (
								<StoryCard
									key={value.info.id}
									id={value.info.id}
									title={value.info.name}
									description={value.info.description}
									archived={value.info.archived}
									enableStory={enableStory}
									{...props}
								/>
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
	const [stories, setStories] = useState({ error: null, isLoaded: false, items: [] });
	const onEditStory = idStory => {
		history.push(`${match.path}/story/overview`, { idStory: idStory });
	};

	return (
		<Switch>
			<Route exact path='/autore'>
				<AutoreHome onEditStory={onEditStory} setStories={setStories} stories={stories}/>
			</Route>
			<Route exact path={`${match.path}/story`}>
				<Container fluid>
					<NavbarAutore name='Creazione storia' />
					<StoryIndex />
				</Container>
			</Route>
			<Route exact path={`${match.path}/story/overview`}>
				<Container fluid>
					<NavbarAutore name='Riassunto storia' />
					<StoryOverview />
				</Container>
			</Route>
			<Route path={`${match.path}/story/activities`}>
				<Container fluid>
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
				<Container fluid>
					<NavbarAutore name='Crea attività' />
					<Activity />
				</Container>
			</Route>
		</Switch>
	);
}

export default Autore;
