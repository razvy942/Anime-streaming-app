import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';

import axios from 'axios';
import classes from './CurrentSeason.module.css';

const CurrentSeason = ({ history }) => {
	// use these for pagination
	// TODO: INTRODUCE PAGINATION
	const [page, setPage] = useState(1);
	const [links, setLinks] = useState(null);
	const apiUrl = 'http://localhost:9000/public/v3/season';

	const getCurrentSeason = () => {
		setTimeout(() => {
			axios.get(apiUrl).then(data => {
				setLinks(data.data.anime);
				//console.log(data.data);
			});
		}, 500);
	};

	useEffect(() => {
		getCurrentSeason();
	}, []);

	return (
		<div className={['container', classes.main].join(' ')}>
			{links ? (
				links.map(link => (
					<Card
						onClick={() => {
							history.push(`/info/${link.mal_id}`);
						}}
						className={['card-spacing', classes.card].join(' ')}
						style={{
							width: '17rem',
							margin: '18px'
						}}
						key={link.mal_id}
					>
						<Card.Img
							variant="top"
							src={link.image_url}
							style={{ width: '100%' }}
						/>
						<Card.Body>
							<Card.Title>{link.title}</Card.Title>
						</Card.Body>
					</Card>
				))
			) : (
				<Spinner animation="border" variant="secondary" />
			)}
		</div>
	);
};

export default CurrentSeason;
