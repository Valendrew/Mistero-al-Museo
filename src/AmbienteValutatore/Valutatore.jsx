import React, { useEffect, useState, useMemo } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import SideBar from './SideBar';
import PlayerInfo from './PlayerInfo';

function Valutatore() {
	const [stories, setStories] = useState();
	const [players, setPlayers] = useState();
	const [playerSelected, setPlayerSelected] = useState(null);
	const [isLoaded, setIsLoaded] = useState({ loaded: false, error: null });
	const [inputs, setInputs] = useState();

	const setPlayerDashboard = (idPlayer, status, idStory) => {
		setPlayerSelected({
			story: idStory,
			status: status,
			id: idPlayer
		});
		setInputs({ name: { value: status.name, error: false }, answer: {value: status.answer, error: false} });
	};

	const updateStatus = (idStory, idPlayer, statusName, statusValue) => {
		const index = stories.findIndex(element => element.info.id === idStory);
		let newPlayers = [...players];
		newPlayers[index] = {
			...newPlayers[index],
			[idPlayer]: { ...newPlayers[index][idPlayer], [statusName]: statusValue }
		};
		if (playerSelected.id === idPlayer) {
			setInputs({...inputs, [statusName]: {value: statusValue, error: false}});
			setPlayerSelected({ ...playerSelected, status: { ...playerSelected.status, [statusName]: statusValue } });
		}
		setPlayers(newPlayers);
	};

	/* const fetchStatusAtInterval = useMemo(async () => {
		if (isLoaded.loaded) {
			const result = await fetch('/games/status');
			if (!result.ok) setTimeout(fetchStatusAtInterval(), 500);
			else {
				const data = await result.json();

				fetch(`/games/${data.story}/players/${data.player}`)
					.then(status => status.json())
					.then(statusData => {
						fetchStatusAtInterval();
					})
					.catch(e => console.log(e));
			}
		}
	}, [isLoaded]); */

	const fetchAnswerAtInterval = useMemo(async () => {
		if (isLoaded.loaded) {
			const result = await fetch('/games/answer');
			if (!result.ok) fetchAnswerAtInterval();
			else {
				const data = await result.json();
				fetch(`/games/${data.story}/players/${data.player}`)
					.then(status => status.json())
					.then(statusData => {
						updateStatus(data.story, data.player, "answer", statusData.answer);
						fetchAnswerAtInterval();
					})
					.catch(e => console.log(e));
			}
		}
	}, [isLoaded]);
	/*
	const fetchChatAtInterval = useMemo(async () => {
		if (isLoaded.loaded) {
			const result = await fetch('/games/chat');
			if (!result.ok) fetchAnswerAtInterval();
			else {
				const data = await result.json();
				fetch(`/games/${data.story}/players/${data.player}`)
					.then(status => status.json())
					.then(statusData => {
						updateStatus(data.story, data.player, "chat", statusData.chat);
						fetchAnswerAtInterval();
					})
					.catch(e => console.log(e));
			}
		}
	}, [isLoaded]);
	*/
	/*useEffect(() => {
		const interval = setInterval(async () => {
			
			if (isLoaded.loaded) {
				console.log("edo");
				const result = await fetch('/games/answer');
				if (result.ok) {
					const data = await result.json();
					fetch(`/games/${data.story}/players/${data.player}`)
						.then(status => status.json())
						.then(statusData => {
							updateStatus(data.story, data.player, 'answer', statusData.answer);
						})
						.catch(e => console.log(e));
				}
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [isLoaded]);
	*/

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
