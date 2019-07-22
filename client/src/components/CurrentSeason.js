import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';

import ShowList from './UI/ShowList';
import myClasses from './CurrentSeason.module.css';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper
	},
	gridList: {
		width: '100%',
		height: '100%'
	},

	icon: {
		color: 'rgba(255, 255, 255, 0.54)'
	}
}));

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
				setLinks(paginateResults(data.data.anime, 9));
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

	const classes = useStyles();

	return (
		<div className={myClasses.h}>
			{links ? (
				<div className={classes.root}>
					<GridList cellHeight={180} className={classes.gridList}>
						<GridListTile
							key="Subheader"
							cols={2}
							style={{ height: 'auto' }}
						/>
						{page.map(pg =>
							links[pg].map(link => (
								<GridListTile
									onClick={() => {
										history.push(`/info/${link.mal_id}`);
									}}
									style={{
										width: '280px',
										height: '200px',
										margin: '12px',
										alignSelf: 'flex-start'
									}}
									key={link.mal_id}
								>
									<img
										src={link.image_url}
										alt={link.title}
									/>
									<GridListTileBar
										title={link.title}
										subtitle={
											<span>Rating: {link.score}</span>
										}
									/>
								</GridListTile>
							))
						)}
					</GridList>
				</div>
			) : (
				<div
					style={{
						marginTop: '50vh'
					}}
				>
					<CircularProgress />
				</div>
			)}
			{links && <button onClick={changePage}>Load more results</button>}
		</div>
	);
};

export default CurrentSeason;
