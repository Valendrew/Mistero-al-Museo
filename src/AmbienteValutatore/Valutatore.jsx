import React, { useEffect, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SideBar from './SideBar';
import PlayerInfo from './PlayerInfo';
import useInterval from './useInterval';

function Valutatore() {
	const [stories, setStories] = useState();
	const [players, setPlayers] = useState();
	const [playerSelected, setPlayerSelected] = useState();
	const [inputs, setInputs] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });

	const setPlayerDashboard = (idPlayer, status, idStory) => {
		setPlayerSelected({
			story: idStory,
			status: status,
			id: idPlayer
		});
		setInputs({ name: { value: status.name, error: false }, answer: { value: status.answer, error: false } });
	};

	const updateStatus = (idStory, idPlayer, status) => {
		/* Ricerco l'indice della storia richiesta */
		const index = stories.findIndex(element => element.info.id === idStory);

		let newPlayers = [...players];
		newPlayers[index] = {
			...newPlayers[index],
			[idPlayer]: { ...newPlayers[index][idPlayer], ...status }
		};

		if (playerSelected && playerSelected.id === idPlayer) {
			//setInputs({ ...inputs, [statusName]: { value: statusValue, error: false } });
			setPlayerSelected({ ...playerSelected, status: { ...playerSelected.status, ...status } });
		}
		setPlayers(newPlayers);
	};

	/* useInterval(
		async () => {
			const result = await fetch('/games/status');
			if (result.ok) {
				result.json().then(data => {
					console.log(data);
					Object.entries(data).forEach(([player, info]) => {
						Object.entries(info.status).forEach(([key, value]) => {
							updateStatus(info.story, player, key, value);
						});
					});
				});
			}
		},
		isLoaded.loaded ? 10000 : 10000
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
		isLoaded.loaded ? 10000 : 10000
	); */

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
							idStory={playerSelected.story}
							id={playerSelected.id}
							status={playerSelected.status}
							updateStatus={updateStatus}
							inputs={inputs}
							setInputs={setInputs}
						/>
					</Col>
				) : null}
			</Row>
		)
	) : null;
}
export default Valutatore;
