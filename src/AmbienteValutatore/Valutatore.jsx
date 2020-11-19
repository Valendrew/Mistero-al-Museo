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

	const setPlayerDashboard = (idPlayer, status, idStory) => {
		setPlayerSelected({
			story: idStory,
			status: status,
			id: idPlayer
		});
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
						/>
					</Col>
				) : null}
			</Row>
		)
	) : null;
}
export default Valutatore;
