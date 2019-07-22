import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import classes from './SideBar.module.css';

const SideBar = ({ img, score, currentlyAiring }) => {
	const materialClasses = makeStyles(theme => ({
		button: {
			margin: theme.spacing(1)
		},
		input: {
			display: 'none'
		}
	}));

	useEffect(() => {
		console.log(img, score);
	}, []);
	return (
		<div style={{ height: '96vh' }}>
			<main className={classes.main}>
				<img src={img} className={classes.card} alt="Anime" />
				<div className={classes.action}>
					<Button
						variant="contained"
						color="primary"
						className={materialClasses.button}
					>
						heart
					</Button>
					<Button
						variant="contained"
						color="secondary"
						className={classes.button}
					>
						Secondary
					</Button>
				</div>
			</main>
		</div>
	);
};

const useStyles = makeStyles(theme => ({
	button: {
		margin: theme.spacing(1)
	},
	input: {
		display: 'none'
	}
}));

export default SideBar;
