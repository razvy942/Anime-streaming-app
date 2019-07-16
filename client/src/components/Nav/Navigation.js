import React, { Component } from 'react';
import {
	Navbar,
	Nav,
	Dropdown,
	Button,
	Form,
	FormControl
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Navigation extends Component {
	goGome = () => {
		this.props.defaultPage();
		this.props.history.push('/');
	};

	getNewReleases = () => {
		this.props.getNewReleases();
		this.props.history.push('/');
	};

	handleSearch = () => {
		this.props.handleSearch();
		this.props.history.push('/');
	};

	render() {
		return (
			<Navbar
				style={{
					boxShadow: '0px 0px 18px #333'
				}}
				className="fixed-top"
				bg="dark"
				variant="dark"
				expand="lg"
			>
				<Navbar.Brand
					style={{ cursor: 'pointer' }}
					onClick={this.goGome}
				>
					Waifu time
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link onClick={this.props.getNewReleases}>
							New Releases
						</Nav.Link>
					</Nav>
					<Dropdown style={{ marginRight: '10px' }}>
						<Dropdown.Toggle variant="info" id="dropdown-basic">
							Select Resolution ({this.props.selectedRes})
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item
								onClick={() => this.props.selectRes('1080p')}
							>
								1080p
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => this.props.selectRes('720p')}
							>
								720p
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() => this.props.selectRes('480p')}
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
							onChange={this.props.handleSearchInput}
							value={this.props.currentSearch}
						/>
						<Button type="submit" onClick={this.props.handleSearch}>
							Search
						</Button>
					</Form>
					<Button onClick={this.props.showLoginModal}>Login</Button>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default withRouter(Navigation);
