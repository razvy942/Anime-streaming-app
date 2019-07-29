import React, { useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import logo from '../../assets/logo.svg';
import Login from './Login';
import Modal from './Modal';
import SearchField from './SearchField';
import classes from './Navbar.module.css';

export default function Navbar(props) {
	const [showLoginForm, setShowLoginForm] = useState(false);

	const toggleLogin = () => {
		setShowLoginForm(true);
	};

	const closeLogin = () => {
		setShowLoginForm(false);
	};

	return (
		<div className={classes.container}>
			<div className={classes.interact}>
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
			</div>
			<div className={classes.searchBar}>
				<div className={classes.searchInput}>
					<SearchField {...props} />
				</div>
			</div>
			<div className={classes.login}>
				<div className={classes.loginInput}>
					<Modal>
						<Login />
					</Modal>
				</div>
			</div>
		</div>
	);
}
