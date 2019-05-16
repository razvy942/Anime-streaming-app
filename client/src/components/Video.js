import React, { Component } from "react";
import { Player } from "video-react";
import axios from "../axios-instance";

class Video extends Component {
  state = {
    isReady: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isReady: true });
    }, 1000);
  }

  render() {
    return (
      <div>
        {this.state.isReady ? (
          <Player playsInline src="http://localhost:5000/stream/mov" />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default Video;
