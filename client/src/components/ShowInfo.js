import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';

import SideBar from './UI/SideBar';
import Info from './UI/MainShowInfo';

const ShowInfo = props => {
	const [info, setInfo] = useState(null);

	const getInfo = () => {
		return axios
			.get(
				`http://localhost:9000/public/v3/anime/${props.match.params.id}`
			)
			.then(data => {
				setInfo(data.data);
				return data.data;
			});
	};

	useEffect(() => {
		getInfo().then(data => console.log(data));
	}, []);

	return (
		<div>
			{info ? (
				<div>
					<SideBar
						score={info.score}
						currentlyAiring={info.airing}
						img={info.image_url}
					/>
					<Info title={info.title} synopsis={info.synopsis} />
				</div>
			) : (
				<Spinner animation="border" variant="secondary" />
			)}
		</div>
	);
};

export default ShowInfo;
