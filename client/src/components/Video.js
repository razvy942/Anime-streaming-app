import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import openSocket from 'socket.io-client';

import axios from '../axios-instance';
import Classes from './Video.module.css';

//import subs from '../subOut.vtt';

class Video extends Component {
	state = {
		isReady: false
	};

	vidRef = React.createRef();
	socket;

	addSubs = data => {
		let cue = new VTTCue(
			parseInt(data.time) / 1000,
			(parseInt(data.time) + parseInt(data.duration)) / 1000,
			data.text
		);
		this.vidRef.current.textTracks[0].addCue(cue);
	};

	componentDidMount() {
		setTimeout(() => {
			//this.setState({ isReady: true });
			console.log(this.props);
			axios.get('/get-subs');
		}, 2500);

		this.socket = openSocket('http://localhost:5000');
		this.socket.on('subs', data => {
			console.log(data.text);
			if (this.vidRef.current) {
				this.addSubs(data);
			} else {
				//console.log('no video ref');
			}
		});
	}

	componentWillUnmount() {
		// killing streams when video stops playing
		this.socket.disconnect();
		axios.get('/stop-subs');
		axios.get('/kill-stream');
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

	seekingAction = () => {
		// TODO: check if subs are finished parsing, if not re-send request
		// First remove all previous cues
		let cues = this.vidRef.current.textTracks[0].cues;
		for (let i = 0; i < cues.length; i++) {
			this.vidRef.current.textTracks[0].removeCue(cues[0]);
		}
		axios
			.get('/stop-subs')
			.then(res => axios.get('/get-subs'))
			.catch(axios.get('/get-subs'));
	};

	render() {
		return (
			<React.Fragment>
				<div className={Classes.main}>
					<video
						ref={this.vidRef}
						width="100%"
						autoPlay
						controls
						onSeeked={this.seekingAction}
					>
						<source
							src={`http://localhost:5000/api/stream/${
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

					{!this.state.isReady && (
						<div className={Classes.spinner}>
							<Spinner animation="border" variant="secondary" />
							<p>Video is being loaded...</p>
						</div>
					)}
					<button onClick={this.addSubs}>play</button>
					<button onClick={this.fastForward}>Fast Forward</button>
				</div>
			</React.Fragment>
		);
	}
}

export default Video;
