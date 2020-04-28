import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import MainPage from './components/MainPage';
import NavBar from './components/UI/Navbar/NavBar';
import ShowInfo from './components/ShowInfo/ShowInfo';
import VideoPlayer from './components/VideoPlayer/Player';
import DownloadManager from './components/DownloadManager/DownloadManager';
import './App.css';

//const history = createHashHistory();

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <NavBar />
        </nav>

        <Route exact path="/">
          <MainPage isHomePage={true} isAllShows={false} />
        </Route>
        <Route exact path="/all-shows/:page">
          <MainPage isHomePage={false} isAllShows={true} />
        </Route>
        <Route exact path="/player">
          <VideoPlayer />
        </Route>
        <Route exact path="/show/:title">
          <ShowInfo />
        </Route>
        <Route exact path="/manage-downloads">
          <DownloadManager />
        </Route>
      </div>
    </Router>
  );
}

export default App;
