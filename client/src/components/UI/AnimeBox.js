import React from 'react';

import classes from './AnimeBox.module.css';

export default function AnimeBox({ image, title }) {
	return (
		<div>
			<div data-content={title} className={classes.image}>
				<img src={image} alt={title} />
			</div>
		</div>
	);
}
