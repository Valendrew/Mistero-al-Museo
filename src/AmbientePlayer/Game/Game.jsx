import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import { useHistory } from "react-router-dom";
import Storyline from "./Storyline";

function Game() {
	const history = useHistory();
	const { player, story, activity } = history.location.state;
	useEffect(() => {}, [player]);
	console.log(activity);
	return (
		<Container>
			<h5>
				Benvenuto {player} all'attività {activity}
				<Storyline storyline={story.activities[activity].storyline} />
			</h5>
		</Container>
	);
}

export default Game;
