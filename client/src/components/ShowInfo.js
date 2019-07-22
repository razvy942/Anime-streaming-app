import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

import SideBar from './UI/SideBar';
import Information from './UI/MainShowInfo';
import classes from './ShowInfo.module.css';

const ShowInfo = props => {
	const [info, setInfo] = useState(null);

	const getInfo = () => {
		return axios
			.get(
				`http://localhost:9000/public/v3/anime/${props.match.params.id}`
			)
			.then(data => {
				setInfo(data.data);
				console.log(data.data);
				//return data.data;
			})
			.catch(err => console.log('suck my fkg dick' + err + info));
	};

	useEffect(() => {
		getInfo().then(data => console.log(data));
	}, []);

	return (
		<div className={classes.container}>
			{info ? (
				<div className={classes.main}>
					<SideBar
						score={info.score}
						currentlyAiring={info.airing}
						studio={info.studios}
						genres={info.genres}
						img={info.image_url}
					/>

					<Information synopsis={info.synopsis} title={info.title} />
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
		</div>
	);
};

export default ShowInfo;
