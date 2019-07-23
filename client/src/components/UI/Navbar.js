import React from 'react';
import { Typography, Button } from '@material-ui/core';

import logo from '../../assets/logo.svg';
import SearchField from './SearchField';
import classes from './Navbar.module.css';

export default function Navbar(props) {
	return (
		<div className={classes.container}>
			<div className={classes.logo}>
				<Button
					onClick={() => props.history.push('/')}
					style={{ color: 'white' }}
				>
					<Typography variant="h6" component="p">
						Waifu Time
					</Typography>
				</Button>
			</div>

			<div className={classes.selection}>
				<Button
					onClick={() => props.history.push('/current-season')}
					style={{ color: 'white' }}
				>
					<Typography variant="body1" component="p">
						{' '}
						Current Season
					</Typography>
				</Button>
			</div>
			<div className={classes.search}>
				<SearchField {...props} />
			</div>
		</div>
	);
}
