import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Video from "./components/Video";
import Animelist from "./components/Animelist";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={Animelist} />
        <Route path="/watch" component={Video} />
      </BrowserRouter>
    </div>
  );
}

export default App;
