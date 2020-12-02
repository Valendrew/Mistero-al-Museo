import React from 'react';

import MissionsTransitions from '../missions/MissionsTransitions';
import StoryTheme from './StoryTheme';

function StoryConclusion() {
	return (
		<>
			{/* Transizioni missioni */}
			<MissionsTransitions />

			{/* Temi del player */}
			<StoryTheme />

			{/* Fasce conclusive storia */}
		</>
	);
}

export default StoryConclusion;
