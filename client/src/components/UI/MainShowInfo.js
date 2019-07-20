import React from 'react';

const Info = ({ synopsis, title }) => {
	return (
		<div>
			{title}
			<br />
			{synopsis}
		</div>
	);
};

export default Info;
