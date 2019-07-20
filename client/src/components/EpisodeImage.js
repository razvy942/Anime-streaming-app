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
			// settimeout because theres a limit of 2 requests per second
			setTimeout(() => {
				axios
					.get(`http://localhost:9000/public/v3/anime/${data}`)
					.then(res => {
						//console.log(res.data);
						this.setState({
							image_url: res.data.image_url
						});
					})
					.catch(err => {
						console.log(`MAL API error ${err}`);
						this.setState({
							image_url:
								'https://i.kym-cdn.com/photos/images/original/001/359/428/77e.gif'
						});
					});
			}, 500);
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
