import React from 'react';

import Backdrop from './Backdrop';
import './Modal.css';

export default function Modal(props) {
	return (
		<>
			<Backdrop clicked={props.clicked} show={props.show} />
			<div
				className={'Modal'}
				style={{
					transform: props.show
						? 'translateY(0)'
						: 'translateY(-100vh)'
				}}
			>
				<div className="Title">{props.title}</div>
				<div className="Subtitle">{props.subtitle}</div>
				<div className="Content">{props.children}</div>
			</div>
		</>
	);
}
