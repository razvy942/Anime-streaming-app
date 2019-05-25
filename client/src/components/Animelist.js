import React, { Component } from 'react';
import {
	Button,
	Nav,
	Navbar,
	Form,
	FormControl,
	Card,
	Dropdown
} from 'react-bootstrap';

import './Animelist.css';
import Loader from './Loader';
import NotFound from './Notfound';
import EpCard from './EpisodeImage';
import axios from '../axios-instance';
import { throws } from 'assert';

// https://api.jikan.moe/v3/search/anime?q=${title}&page=1  search only page 1 results are relevant

// https://api.jikan.moe/v3/anime/${id}  gives info about show by id

export default class Animelist extends Component {
	state = {
		links: {},
		currentSearch: '',
		loaded: false,
		selectedRes: '1080p'
	};

	componentDidMount = () => {
		this.defaultPage();
	};

	defaultPage = () => {
		this.getLinks('');
	};

	getLinks = val => {
		this.setState({ links: {}, loaded: false });
		axios
			.get(`api/get-links${val}`)
			.then(data => {
				console.log(data);
				this.setState({
					links: data.data.HorribleSubs,
					loaded: true
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
			.then(this.props.history.push(`/watch/${title}`));
	};

	getNewReleases = () => {
		this.getLinks('?search=[HorribleSubs]');
	};

	handleSearch = e => {
		e.preventDefault();
		this.getLinks(`?search=[HorribleSubs] ${this.state.currentSearch}`);
	};

	handleSearchInput = e => {
		this.setState({
			currentSearch: e.target.value
		});
	};

	selectRes = resolution => {
		this.setState({
			selectedRes: resolution
		});
		this.getNewReleases();
	};

	render() {
		return (
			<>
				{/* {	<nav className="nav-bar">
					<form>
						<input
							placeholder="Type the name of the show "
							value={this.state.currentSearch}
							onChange={this.handleSearchInput}
						/>
						<Button
							variant="primary"
							onClick={this.handleSearch}
							type="submit"
						>
							Search
						</Button>
					</form>
					<ul>
						<li onClick={this.getNewReleases}>
							<Button>New Releases</Button>
						</li>
						<li>
							<Button>All shows</Button>
						</li>
					</ul>
        </nav>} */}

				<Navbar
					className="fixed-top"
					bg="dark"
					variant="dark"
					expand="lg"
				>
					<Navbar.Brand
						style={{ cursor: 'pointer' }}
						onClick={this.defaultPage}
					>
						Waifu time
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Nav.Link onClick={this.getNewReleases}>
								New Releases
							</Nav.Link>
						</Nav>
						<Dropdown style={{ marginRight: '10px' }}>
							<Dropdown.Toggle variant="info" id="dropdown-basic">
								Select Resolution ({this.state.selectedRes})
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item
									onClick={() => this.selectRes('1080p')}
								>
									1080p
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => this.selectRes('720p')}
								>
									720p
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => this.selectRes('480p')}
								>
									480p
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Form inline>
							<FormControl
								type="text"
								placeholder="Search"
								className="mr-sm-2"
								onChange={this.handleSearchInput}
							/>
							<Button type="submit" onClick={this.handleSearch}>
								Search
							</Button>
						</Form>
					</Navbar.Collapse>
				</Navbar>
				<div className="episodes container">
					{this.state.loaded ? (
						Object.keys(this.state.links).map(key => {
							return (
								<Card
									className="card-spacing"
									style={{
										width: '12rem',
										margin: '10px'
									}}
									key={key}
								>
									{/* <Card.Img
										variant="top"
										src="https://66.media.tumblr.com/dfc08dc2cf210659031a3bcc404381cd/tumblr_o70k5ji9a31qla6e4o1_1280.jpg"
                  /> */}
									<EpCard title={key} />
									<Card.Body>
										<Card.Title>{key}</Card.Title>

										{Object.keys(this.state.links[key]).map(
											ep => {
												let epLink;

												try {
													epLink = this.state.links[
														key
													][ep][
														this.state.selectedRes
													][2];
												} catch (err) {
													epLink = 'No data found';
												}

												return (
													<>
														<Button
															className="episode-spacing"
															onClick={() =>
																this.addMagnetClickHandler(
																	epLink,
																	key
																)
															}
															key={key + ep}
														>
															{ep}:{' '}
															{
																this.state
																	.selectedRes
															}
															: click here to
															watch
														</Button>
													</>
												);
											}
										)}
									</Card.Body>
								</Card>
							);
						})
					) : (
						<Loader />
					)}
					{this.state.loaded &&
						Object.keys(this.state.links).length == 0 && (
							<NotFound />
						)}
				</div>
			</>
		);
	}
}
