import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

import Classes from './Video.module.css';
import Loader from './Loader';
//import subs from './out.vtt';

class Video extends Component {
	state = {
		isReady: false
	};

	vidRef = React.createRef();

	componentDidMount() {
		setTimeout(() => {
			this.setState({ isReady: true });
			console.log(this.props);
		}, 1500);
	}

	toggleVid = () => {
		let currentTime = this.vidRef.current.currentTime;
		let duration = this.vidRef.current.duration;

		console.log((currentTime / duration) * 100);

		if (this.vidRef.current.paused) {
			this.vidRef.current.play();
		} else {
			this.vidRef.current.pause();
		}
	};

	fastForward = () => {
		this.vidRef.current.currentTime += 10;
	};

	render() {
		return (
			<div className={Classes.main}>
				{this.state.isReady ? (
					<video ref={this.vidRef} width="100%" autoPlay controls>
						<source
							src={`http://localhost:5000/stream/${
								this.props.match.params.file
							}`}
							type="video/webm"
						/>
						<track
							label="English"
							kind="subtitles"
							srclang="en"
							default
						/>
					</video>
				) : (
					<div className={Classes.spinner}>
						<Spinner animation="border" variant="secondary" />
						<p>Video is being loaded...</p>
					</div>
				)}
				{/* <button onClick={this.toggleVid}>play</button>
				<button onClick={this.fastForward}>Fast Forward</button> */}
			</div>
		);
	}
}

export default Video;
