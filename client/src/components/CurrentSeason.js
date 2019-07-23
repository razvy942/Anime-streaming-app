import React from 'react';

import Animes from './List';

export default function CurrentSeason({ history }) {
	return (
		<div>
			<Animes
				history={history}
				searchLink="https://api.jikan.moe/v3/season"
			/>
		</div>
	);
}
