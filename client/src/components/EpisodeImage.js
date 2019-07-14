import React, { Component } from 'react';
import { Card, Spinner } from 'react-bootstrap';

import axios from '../axios-instance';
import { getMalId } from '../helpers/helpers';

export default class EpisodeImage extends Component {
	state = {
		image_url: null,
		id: null
	};

	getImage = () => {
		getMalId(this.props.title).then(data => {
			console.log(data);
			this.setState({
				id: data
			});
			axios.get(`https://api.jikan.moe/v3/anime/${data}`).then(res => {
				console.log(res.data);
				this.setState({
					image_url: res.data.image_url
				});
			});
		});
	};

	componentWillMount() {
		this.getImage();
	}

	render() {
		return (
			<>
				{this.state.image_url ? (
					<Card.Img variant="top" src={this.state.image_url} />
				) : (
					<Spinner animation="border" variant="secondary" />
				)}
			</>
		);
	}
}
