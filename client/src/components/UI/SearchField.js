import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import axios from '../../axios-instance';
import Animes from '../List';
import { getLinks } from '../../helpers/helpers';

export default function CustomizedInputBase({ history }) {
	const classes = useStyles();
	const [searchVal, setSearchVal] = useState('');

	const onChange = e => {
		setSearchVal(e.target.value);
	};

	const handleSearch = () => {
		getLinks(searchVal)
			.then(data => {
				console.log(data);
				history.push(`/search/${searchVal}`);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<Paper className={classes.root}>
			<InputBase
				value={searchVal}
				onChange={onChange}
				className={classes.input}
				placeholder="Search for something to watch"
				inputProps={{ 'aria-label': 'Search for something to watch' }}
			/>
			<IconButton
				onClick={handleSearch}
				className={classes.iconButton}
				aria-label="Search"
			>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}

const useStyles = makeStyles({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		height: '50%'
	},
	input: {
		marginLeft: 8,
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		width: 1,
		height: 27,
		margin: 4
	}
});
