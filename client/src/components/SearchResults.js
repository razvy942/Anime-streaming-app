import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';

import Animes from './List';
import { getLinks } from '../helpers/helpers';

export default function SearchResults({ match, history }) {
	const [search, setSearch] = useState(null);

	useEffect(() => {
		const searchLink = `https://api.jikan.moe/v3/search/anime?q=${
			match.params.title
		}`;
		setSearch(searchLink);
	});

	return (
		<div>
			{search ? (
				<Animes history={history} searchLink={search} />
			) : (
				<CircularProgress />
			)}
		</div>
	);
}
