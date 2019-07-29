import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Typography } from '@material-ui/core';

function rand() {
	return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
	const top = 50 + rand();
	const left = 50 + rand();

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 700,
		height: 800,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 4),
		outline: 'none'
	}
}));

export default function SimpleModal(props) {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				onClick={handleOpen}
				style={{ color: 'white', background: 'none' }}
			>
				<Typography variant="body1" component="p">
					{' '}
					Login
				</Typography>
			</Button>

			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={open}
				onClose={handleClose}
			>
				<div style={modalStyle} className={classes.paper}>
					<div style={{ height: '90%' }}>
						<h2 style={{ textAlign: 'center' }} id="modal-title">
							LOGIN
						</h2>
						{props.children}
					</div>
				</div>
			</Modal>
		</div>
	);
}
