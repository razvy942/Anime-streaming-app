import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';

import Video from './components/Video';
import Animelist from './components/Animelist';
import CurrentSeason from './components/CurrentSeason';
import ShowInfo from './components/ShowInfo';
import Navbar from './components/UI/Navbar';
import SearchResults from './components/SearchResults';
import './App.css';

function App() {
	return (
		<div className="App">
			<div style={{ marginTop: '5vh' }}>
				<BrowserRouter>
					<Route path="/" component={Navbar} />
					<Switch>
						<Route path="/" exact component={Animelist} />
						<Route
							path="/current-season"
							component={CurrentSeason}
						/>
						<Route path="/info/:id" component={ShowInfo} />
						<Route path="/watch/:file" component={Video} />
						<Route
							path="/search/:title"
							component={SearchResults}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
