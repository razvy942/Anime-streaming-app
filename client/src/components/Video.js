import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

import axios from '../axios-instance';
import Classes from './Video.module.css';

//import subs from '../subOut.vtt';

class Video extends Component {
	state = {
		isReady: false,
		subtitles: [],
		time: 0
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.state.subtitles === nextState.subtitles &&
			this.state.time === nextState.time
		);
	}

	vidRef = React.createRef();

	addSubs = time => {
		// const cue = new VTTCue(
		// 	638120 / 1000,
		// 	638220 / 1000,
		// 	'Hello fellow weeb'
		// );
		//console.log(this.vidRef.current.textTracks);
		//this.vidRef.current.textTracks[0].addCue(cue);
		//let currentTime = this.vidRef.current.currentTime;
		// console.log(
		// 	this.vidRef.current !== null && this.vidRef.current.duration
		// )
		this.state.subtitles.forEach(sub => {
			Object.keys(sub).forEach(key => {
				let cue = new VTTCue(
					parseInt(key) / 1000,
					parseInt(key) + parseInt(sub[key].duration) / 1000,
					sub[key].text
				);
				//console.log(key + ', ' + time);
				//console.log(key == time);
				this.vidRef.current.textTracks[0].addCue(cue);
			});
			//console.log(sub.time + ', ' + time);
		});
	};

	componentDidMount() {
		// setTimeout(() => {
		// 	//this.setState({ isReady: true });
		// 	console.log(this.props);
		// 	axios.get('/get-subs');
		// }, 2500);

		this.interval = setInterval(() => {
			axios
				// .get(`/get-track/${this.state.time * 1000}`)
				// .then(data => {
				// 	console.log(data);
				// 	this.setState({
				// 		subtitles: data.data.subtitle
				// 	});
				// 	this.addSubs(0);
				// })
				// .catch(err => console.log(err));
				.get('/is-file-ready')
				.then(res => {
					console.log(res.data.ready);
					if (res.data.ready) {
						axios.get('get-subs');
						clearInterval(this.interval);
					}
				});
		}, 1000);

		let vidInterval = setInterval(() => {
			if (this.vidRef.current !== null) {
				this.setState({
					isReady: true
				});
				clearInterval(vidInterval);
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		clearInterval(this.subInterval);
		// killing streams when video stops playing
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

	fastForward = () => {
		this.vidRef.current.currentTime += 10;
	};

	render() {
		return (
			<React.Fragment>
				<div className={Classes.main}>
					<video ref={this.vidRef} width="100%" autoPlay controls>
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
							src={'../subOut.vtt'}
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
