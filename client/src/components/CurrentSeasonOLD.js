import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { CircularProgress } from '@material-ui/core';
import { Container } from '@material-ui/core';
import axios from 'axios';

import Spinner from './UI/Spinner';
import AnimeBox from './UI/AnimeBox';
import myClasses from './CurrentSeason.module.css';

const CurrentSeason = ({ history }) => {
	// use these for pagination
	// TODO: INTRODUCE PAGINATION
	const [pages, setPages] = useState(null);
	const [page, setPage] = useState([1]);
	const [links, setLinks] = useState(null);
	const apiUrl = 'https://api.jikan.moe/v3/season';

	const getCurrentSeason = () => {
		setTimeout(() => {
			axios.get(apiUrl).then(data => {
				setLinks(paginateResults(data.data.anime, 10));
			});
		}, 500);
	};

	/** API gives back all the results, we have to split the pages inside the state so we don't
	 *  make too many network requests at once
	 */
	const paginateResults = (data, pageResults) => {
		const animes = data; // array of objects
		let page = 0;
		let animeObj = {};
		let animeArr = [];

		animes.forEach((anime, index) => {
			if (index % pageResults === 0) {
				page++;
				animeArr = [];
				animeObj[page] = animeArr;
			}
			animeArr.push(animes[index]);
		});
		setPages(page);
		return animeObj;
	};

	const changePage = () => {
		console.log('changing page');

		let currentPage = page[page.length - 1];
		if (currentPage < pages) {
			setPage([...page, currentPage + 1]);
		}
	};

	useEffect(() => {
		getCurrentSeason();
	}, []);

	return (
		<Container maxWidth="lg">
			<div>
				{links ? (
					<div className={myClasses.root}>
						{page.map(pg =>
							links[pg].map(link => (
								<div
									key={link.mal_id}
									onClick={() =>
										history.push(`/info/${link.mal_id}`)
									}
								>
									<AnimeBox
										image={link.image_url}
										title={link.title}
									/>
								</div>
							))
						)}
					</div>
				) : (
					<Spinner />
				)}
				{links && (
					<button onClick={changePage}>Load more results</button>
				)}
			</div>
		</Container>
	);
};

export default CurrentSeason;
