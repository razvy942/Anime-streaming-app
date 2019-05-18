import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import Video from './Video';
import './Animelist.css';
import axios from '../axios-instance';

export default class Animelist extends Component {
	state = { links: null };

	componentDidMount = () => {
		axios
			.get('api/get-links?page=2')
			.then(data => {
				console.log(data);
				this.setState({
					links: data.data.HorribleSubs
				});
			})
			.catch(err => {
				console.log('Error fetching links');
			});
	};

	addMagnetClickHandler = (magnet, title) => {
		console.log(title);
		axios
			.get(`add/${magnet}`)
			.then(this.props.history.push(`/watch/${title.split(' ')[0]}`));
	};

	render() {
		return (
			<>
				<nav className="nav-bar">
					<ul>
						<li className="btn">New Releases</li>
						<li className="btn">All shows</li>
					</ul>
				</nav>
				<div className="container">
					{this.state.links ? (
						Object.keys(this.state.links).map(key => {
							return (
								<ul className="ep-box" key={key}>
									<p className="ep-title">{key}</p>
									{Object.keys(this.state.links[key]).map(
										ep => {
											//let fullHD = this.state.links[key][ep]["1080p"][2];
											let HD = this.state.links[key][ep][
												'720p'
											][2];
											return (
												<>
													<li
														className="btn"
														onClick={() =>
															this.addMagnetClickHandler(
																HD,
																key
															)
														}
														key={
															key + ep + '-1080p'
														}
													>
														{ep}: 1080p: click here
														to watch
													</li>
													<li
														className="btn"
														onClick={() =>
															this.addMagnetClickHandler(
																HD,
																key
															)
														}
														key={key + ep + '-720p'}
													>
														{ep}: 720p: click here
														to watch
													</li>
												</>
											);
										}
									)}
								</ul>
							);
						})
					) : (
						<p>Loading</p>
					)}
				</div>
			</>
		);
	}
}
