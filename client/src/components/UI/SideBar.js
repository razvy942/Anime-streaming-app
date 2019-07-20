import React, { useEffect } from 'react';

const SideBar = ({ img, score, currentlyAiring }) => {
	useEffect(() => {
		console.log(img, score);
	}, []);
	return (
		<div>
			<img src={img} alt="Anime" />
		</div>
	);
};

export default SideBar;
