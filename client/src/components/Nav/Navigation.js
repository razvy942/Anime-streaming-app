import React, { Component } from 'react';
import { Navbar, Nav, Dropdown, Button, Form, FormControl } from 'bootstrap';

export default class Navigation extends Component {
	state = {
		currentSearch: '',
		selectedRes: '1080p'
	};
	render() {
		return (
			<Navbar className="fixed-top" bg="dark" variant="dark" expand="lg">
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
		);
	}
}
