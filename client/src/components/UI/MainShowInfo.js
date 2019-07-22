import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@material-ui/core';

import axios from '../../axios-instance';
import classes from './MainShowInfo.module.css';

const Info = ({ synopsis, title }) => {
	const [ep, setEp] = useState(null);

	const getLinks = val => {
		axios
			.get(`/get-links${val}`)
			.then(data => {
				setEp(data.data.HorribleSubs);
				// setLoaded(true);
			})
			.catch(err => {
				console.log('Error fetching links');
				// setError(true);
			});
	};

	const fetchEpisodes = () => {
		getLinks(`?search=[HorribleSubs] ${title}`);
	};

	useEffect(() => {
		fetchEpisodes();
	}, []);

	return (
		<div style={{ height: '96vh', width: '100%' }}>
			<div className={classes.main}>
				<Typography variant="h4" component="h1">
					{title}
				</Typography>
				<br />
				<Typography variant="body1" component="p">
					{synopsis}
				</Typography>
			</div>
			<div className={classes.content}>
				<Typography variant="h5" component="h2">
					Episodes
				</Typography>

				{ep ? (
					Object.keys(ep).map(epNumber =>
						Object.keys(ep[epNumber]).map(info => (
							<div>
								<p>
									{info}: {ep[epNumber][info]['1080p'][2]}
								</p>
							</div>
						))
					)
				) : (
					<CircularProgress />
				)}
			</div>
		</div>
	);
};

export default Info;
