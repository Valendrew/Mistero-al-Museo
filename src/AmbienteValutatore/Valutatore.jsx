import React, { useEffect, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SideBar from './SideBar';
import PlayerInfo from './PlayerInfo';

function Valutatore() {
	const [playerSelected, setPlayerSelected] = useState(null);
	const [stories, setStories] = useState();
	const [players, setPlayers] = useState();
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [inputs, setInputs] = useState();

	const setPlayerDashboard = (idPlayer, status, idStory) => {
		setPlayerSelected({
			story: idStory,
			status: status,
			id: idPlayer
		});
		setInputs({ name: { value: status.name, error: false } });
	};

	const updateStatus = (idStory, statusUpdated) => {
		const index = stories.findIndex(element => element.info.id === idStory);
		let newPlayers = [...players];
		newPlayers[index] = {
			...newPlayers[index],
			[playerSelected.id]: { ...newPlayers[index][playerSelected.id], ...statusUpdated }
		};
		setPlayers(newPlayers);
		setPlayerSelected({ ...playerSelected, status: { ...playerSelected.status, ...statusUpdated } });
	};

	const fetchStatusAtInterval = async () => {
		const result = await fetch('/games/status');
		if (!result.ok) setTimeout(fetchStatusAtInterval(), 500);
		else {
			const data = await result.json();

			fetch(`/games/${data.story}/players/${data.player}`)
				.then(status => status.json())
				.then(statusData => {
					console.log(statusData);

					fetchStatusAtInterval();
				})
				.catch(e => console.log(e));
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(`/stories`);

			if (!result.ok)
				setStories({
					isLoaded: true,
					error: result.statusText
				});
			else {
				const storiesFetched = await result.json(); // stories
				const playersFetched = await Promise.all(storiesFetched.map(value => fetch(`/games/${value.info.id}/players`)));

				Promise.all(playersFetched.map(res => res.json()))
					.then(data => {
						setStories(storiesFetched);
						setPlayers(data);
						setIsLoaded({ loaded: true });

						fetchStatusAtInterval();
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
