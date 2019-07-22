import React, { useState, useEffect } from 'react';
import {
	Typography,
	CircularProgress,
	Button,
	Container
} from '@material-ui/core';

import axios from '../../axios-instance';
import classes from './MainShowInfo.module.css';

const Info = ({ synopsis, title, history }) => {
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

	const addMagnet = (magnet, name) => {
		axios.get(`add/${magnet}`).then(res => history.push(`/watch/${name}`));
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
							<Typography variant="body1" component="p">
								{info}:{' '}
								<a
									href="#"
									onClick={() =>
										addMagnet(
											ep[epNumber][info]['1080p'][2],
											title
										)
									}
								>
									<Button className={classes.button}>
										Watch now
									</Button>
								</a>
							</Typography>
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
