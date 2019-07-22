import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import openSocket from "socket.io-client";

import axios from "../axios-instance";
import Classes from "./Video.module.css";

class Video extends Component {
  state = {
    isReady: false,
    subsFinished: false,
    canPlay: false
  };

  vidRef = React.createRef();
  socket;

  addSubs = data => {
    // TODO: Style subs
    let cue = new VTTCue(
      parseInt(data.time) / 1000,
      (parseInt(data.time) + parseInt(data.duration)) / 1000,
      data.text
    );
    this.vidRef.current.textTracks[0].addCue(cue);
  };

  componentDidMount() {
    this.socket = openSocket("http://localhost:5000");
    this.socket.on("subs", data => {
      console.log(data.text);
      if (this.vidRef.current) {
        this.addSubs(data);
      }
    });
    this.socket.on("done-sub", data => {
      this.setState({
        subsFinished: true
      });
    });
  }

  componentWillUnmount() {
    // Cleanup
    this.socket.disconnect();
    axios.get("/stop-subs");
    axios.get("/kill-stream");
  }

  toggleVid = () => {
    let currentTime = this.vidRef.current.currentTime;
    let duration = this.vidRef.current.duration;

    console.log((currentTime / duration) * 100);

    if (this.vidRef.current.paused) {
      this.vidRef.current.play();
    } else {
      this.vidRef.current.pause();
    }
  };

  /** If sub-stream not ended, when user fast-forwards the original readstream will lag behind so first clear all cues then re-sub the video
   */
  start = () => {
    this.setState({
      canPlay: true
    });
    if (!this.state.subsFinished) {
      axios
        .get("/stop-subs")
        .then(res => {
          let cues = this.vidRef.current.textTracks[0].cues;
          // Removing previous cues so we don't get duplicates
          for (let i = 0; i < cues.length; i++) {
            this.vidRef.current.textTracks[0].removeCue(cues[0]);
          }
          return;
        })
        .then(() => {
          axios.get("/get-subs");
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className={Classes.main}>
          <video
            style={
              !this.state.canPlay ? { display: "none" } : { display: "block" }
            }
            ref={this.vidRef}
            width="100%"
            autoPlay
            controls
            onSeeked={this.seekingAction}
            onCanPlay={this.start}
          >
            <source
              src={`http://localhost:5000/api/stream/${
                this.props.match.params.file
              }`}
              type="video/webm"
            />
            <track label="English" kind="subtitles" srcLang="en" default />
          </video>

          {!this.state.canPlay && (
            <div className={Classes.spinner}>
              <Spinner animation="border" variant="secondary" />
              <p>Video is being loaded...</p>
            </div>
          )}
        </div>
        <button onClick={this.addSubs}>play</button>
        <button onClick={this.fastForward}>Fast Forward</button>
      </React.Fragment>
    );
  }
}

export default Video;
