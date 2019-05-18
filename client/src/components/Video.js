import React, { Component } from 'react';
import { Player } from 'video-react';
import axios from '../axios-instance';

class Video extends Component {
	state = {
		isReady: false
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState({ isReady: true });
			console.log(this.props);
		}, 1000);
	}

	render() {
		return (
			<div>
				{this.state.isReady ? (
					<video width="70%" autoPlay controls>
						<source
							src={`http://localhost:5000/stream/${
								this.props.match.params.file
							}`}
							type="video/mp4"
						/>
					</video>
				) : (
					<div>Loading...</div>
				)}
			</div>
		);
	}
}

export default Video;
