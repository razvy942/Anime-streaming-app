import React from "react";

import Video from "./components/Video";
import Animelist from "./components/Animelist";
import "./App.css";

function App() {
    return (
        <div className="App">
            <Animelist />
            <Video />
        </div>
    );
}

export default App;
