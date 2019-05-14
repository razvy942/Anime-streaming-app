import React, { Component } from "react";
import { Player } from "video-react";

class Video extends Component {
    render() {
        return (
            <div>
                <Player playsInline src="http://localhost:5000/stream/mov" />
            </div>
        );
    }
}

export default Video;
