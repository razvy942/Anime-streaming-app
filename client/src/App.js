import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';

import Video from './components/Video';
import Animelist from './components/Animelist';
import CurrentSeason from './components/CurrentSeason';
import ShowInfo from './components/ShowInfo';
import Navbar from './components/UI/Navbar';
import './App.css';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={Animelist} />
					<Route path="/current-season" component={CurrentSeason} />
					<Route path="/info/:id" component={ShowInfo} />
					<Route path="/watch/:file" component={Video} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
