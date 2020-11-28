import React, { useEffect, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SideBar from './SideBar';
import PlayerInfo from './PlayerInfo';
import useInterval from '../useInterval';

function Valutatore() {
	const [stories, setStories] = useState();
	const [players, setPlayers] = useState();
	const [playerSelected, setPlayerSelected] = useState();
	const [inputs, setInputs] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	const setPlayerDashboard = (idPlayer, informations, idStory) => {
		setPlayerSelected({
			story: idStory,
			informations: informations,
			id: idPlayer
		});
		setInputs({
			name: { value: informations.name, error: false }
		});
	};

	const updateStatus = (idStory, idPlayer, statusName, statusValue) => {
		/* Ricerco l'indice della storia richiesta */
		const index = stories.findIndex(element => element.info.id === idStory);

		let newPlayers = [...players];
		newPlayers[index] = {
			...newPlayers[index],
			[idPlayer]: { ...newPlayers[index][idPlayer], [statusName]: statusValue }
		};

		if (playerSelected && playerSelected.id === idPlayer) {
			if (statusName === 'name') {
				setInputs({ ...inputs, [statusName]: { value: statusValue, error: false } });
			}
			setPlayerSelected({
				...playerSelected,
				informations: { ...playerSelected.informations, [statusName]: statusValue }
			});
			console.log(playerSelected);
		}
		setPlayers(newPlayers);
	};

	const fetchAnswerCorrection = async (e, idStory, idPlayer, correct, value) => {
		e.preventDefault();

		const result = await fetch(`/games/${idStory}/players/${idPlayer}/question`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question: { value: value, correct: correct }, answer: null })
		});
		if (result.ok) {
			updateStatus(idStory, idPlayer, 'answer', null);
		}
	};

	useInterval(
		async () => {
			const result = await fetch('/games/status');
			if (result.ok) {
				result.json().then(data => {
					console.log(data);
					Object.entries(data).forEach(([key, value]) => {
						updateStatus(value.story, key, 'status', value.status);
					});
				});
			}
		},
		isLoaded.loaded ? 5000 : null
	);

	useInterval(
		async () => {
			const result = await fetch('/games/answers');
			if (result.ok) {
				result.json().then(data => {
					console.log(data);
					Object.entries(data).forEach(([key, value]) => {
						updateStatus(value.story, key, 'answer', value.answer);
					});
				});
			}
		},
		isLoaded.loaded ? 5000 : null
	);

	useEffect(() => {
		const fetchData = async () => {
			const storiesRequest = await fetch(`/stories`);

			if (!storiesRequest.ok)
				setStories({
					isLoaded: true,
					error: storiesRequest.statusText
				});
			else {
				const storiesFetched = await storiesRequest.json(); // stories
				const playersRequested = await Promise.all(
					storiesFetched.map(value => fetch(`/games/${value.info.id}/players`))
				);

				Promise.all(playersRequested.map(res => res.json()))
					.then(playersFetched => {
						setStories(storiesFetched);
						setPlayers(playersFetched);
						setIsLoaded({ loaded: true });
					})
					.catch(e =>
						setStories({
							isLoaded: true,
							error: e.message
						})
					);
			}
		};
		if (!isLoaded.loaded) fetchData();
	}, [isLoaded]);

	return isLoaded.loaded ? (
		isLoaded.error ? (
			<h6>Errore caricamento</h6>
		) : (
			<Row>
				<Col xs={4} lg={3}>
					<SideBar stories={stories} players={players} setPlayer={setPlayerDashboard} />
				</Col>
				{playerSelected ? (
					<Col xs={8} lg={9}>
						<PlayerInfo
							player={playerSelected}
							story={stories.find(element => element.info.id === playerSelected.story)}
							inputs={inputs}
							updateStatus={updateStatus}
							setInputs={setInputs}
							fetchAnswerCorrection={fetchAnswerCorrection}
						/>
					</Col>
				) : null}
			</Row>
		)
	) : null;
}
export default Valutatore;
