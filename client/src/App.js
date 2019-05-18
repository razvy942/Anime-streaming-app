import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Video from './components/Video';
import Animelist from './components/Animelist';
import './App.css';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={Animelist} />
					<Route path="/watch/:file" component={Video} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
