import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Spinner() {
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<CircularProgress />
		</div>
	);
}
