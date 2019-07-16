import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

import axios from '../axios-instance';
import Classes from './Video.module.css';
import Loader from './UI/Loader';
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

	addSubs = () => {
		const cue = new VTTCue(
			638120 / 1000,
			638220 / 1000,
			'Hello fellow weeb'
		);
		console.log(this.vidRef.current.textTracks);
		this.vidRef.current.textTracks[0].addCue(cue);
	};

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
							srcLang="en"
							default
						/>
					</video>
				) : (
					<div className={Classes.spinner}>
						<Spinner animation="border" variant="secondary" />
						<p>Video is being loaded...</p>
					</div>
				)}
				<button onClick={this.addSubs}>play</button>
				<button onClick={this.fastForward}>Fast Forward</button>
			</div>
		);
	}
}

export default Video;
