import path from 'path';
import React from 'react';
// import { ReactMPV } from 'mpv.js';
import ReactMPV from '../../helpers/NewMpv';

import { remote } from 'electron';
import classes from './Player.module.css';
import { withRouter } from 'react-router-dom';
import fs from 'fs';

import Spinner from '../UI/Spinners/Spinner';

class Renderer extends React.Component {
  state = {
    pause: true,
    'time-pos': 0,
    currentTime: 0,
    duration: 0,
    durationStamp: 0,
    fullscreen: false,
    isFileCreated: false,
    showControls: false,
  };

  mpv = null;
  fileCheckerInterval;
  createTimeStampInterval;

  convertTimeStamp = (totalDuration = false) => {
    let timeStamp;
    if (totalDuration) {
      timeStamp = parseInt(this.state.duration) / 60;
    } else {
      timeStamp = parseInt(this.state['time-pos']) / 60;
    }

    let minutes = Math.floor(timeStamp);
    let hours = 0;
    if (minutes > 1 && minutes % 60 === 0) {
      hours += 1;
      minutes -= 60;
      timeStamp -= 60;
    }

    if (hours.toString().length < 2) {
      hours = `0${hours}`;
    }

    if (minutes.toString().length < 2) {
      minutes = `0${minutes}`;
    }

    let seconds;
    if (totalDuration) {
      seconds = parseInt(this.state.duration) % 60;
    } else {
      seconds = parseInt(this.state['time-pos']) % 60;
    }

    if (seconds.toString().length < 2) {
      seconds = `0${seconds}`;
    }

    if (totalDuration) {
      this.setState({
        durationStamp: `${hours}:${minutes}:${seconds}`,
      });
    } else {
      this.setState({
        currentTime: `${hours}:${minutes}:${seconds}`,
      });
    }
  };

  checkForFile = () => {
    if (this.state.isFileCreated) {
      clearInterval(this.fileCheckerInterval);
      return;
    }
    console.log('checking for file');
    console.log(this.props.location.state.path);
    fs.access(this.props.location.state.path, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      clearInterval(this.fileCheckerInterval);
      this.setState({
        isFileCreated: true,
      });
    });
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    console.log(path.join(__dirname, '.'));
    console.log(this.props);

    if (this.props.location.state) {
      this.fileCheckerInterval = setInterval(() => {
        this.checkForFile();
      }, 2000);
    } else {
      this.setState({
        isFileCreated: true,
      });
    }
    this.createTimeStampInterval = setInterval(() => {
      this.convertTimeStamp();
      this.convertTimeStamp(true);
    }, 200);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    clearInterval(this.fileCheckerInterval);
    clearInterval(this.createTimeStampInterval);
  }

  handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === 'f' || (e.key === 'Escape' && this.state.fullscreen)) {
      this.toggleFullscreen();
    } else if (e.key === ' ') {
      this.setState({ pause: !this.state.pause });
      this.mpv.property('pause', this.state.pause);
    } else if (this.state.duration) {
      this.mpv.keypress(e);
    }
  };

  handleMPVReady = (mpv) => {
    this.mpv = mpv;
    const observe = mpv.observe.bind(mpv);
    ['pause', 'time-pos', 'duration', 'eof-reached'].forEach(observe);
    this.mpv.property('hwdec', 'auto');
    //this.mpv.command('loadfile', '.\\vid.mkv');
    let vidPath = '\\vid.mkv';
    if (this.props.location.state) {
      vidPath = this.props.location.state.path;
    }
    this.mpv.command('loadfile', vidPath);
    setTimeout(() => {
      this.mpv.property('pause', false);
    }, 500);
  };

  handlePropertyChange = (name, value) => {
    if (name === 'time-pos' && this.seeking) {
      return;
    } else if (name === 'eof-reached' && value) {
      this.mpv.property('time-pos', 0);
    } else {
      this.setState({ [name]: value });
    }
  };

  toggleFullscreen = () => {
    if (this.state.fullscreen) {
      document.webkitExitFullscreen();
      this.setState({
        fullscreen: false,
      });
    } else {
      this.nodeRef.current.webkitRequestFullscreen();
      this.setState({
        fullscreen: true,
      });
    }
  };

  handleFullScreenToggle = () => {
    this.toggleFullscreen();
  };

  togglePause = (e) => {
    // e.target.blur();
    if (!this.state.duration) return;
    this.mpv.property('pause', !this.state.pause);
  };
  handleStop = (e) => {
    e.target.blur();
    this.mpv.property('pause', true);
    this.mpv.command('stop');
    this.setState({ 'time-pos': 0, duration: 0 });
  };
  handleSeekMouseDown = () => {
    this.seeking = true;
  };
  handleSeek = (e) => {
    e.target.blur();
    const timePos = +e.target.value;
    console.log(this.state.duration);
    console.log(timePos);
    // const currentTime = this.convertTimeStamp(timePos);
    this.setState({ 'time-pos': timePos });

    this.mpv.property('time-pos', timePos);
  };
  handleSeekMouseUp = () => {
    this.seeking = false;
  };
  handleLoad = (e) => {
    e.target.blur();
    remote.dialog
      .showOpenDialog({
        filters: [
          { name: 'Videos', extensions: ['mkv', 'webm', 'mp4', 'mov', 'avi'] },
          { name: 'All files', extensions: ['*'] },
        ],
      })
      .then((res) => {
        if (res.filePaths[0]) this.mpv.command('loadfile', res.filePaths[0]);
      });
  };

  controlsVisibilityTimer = null;
  nodeRef = React.createRef();

  handleMouseIn = () => {
    if (this.controlsVisibilityTimer)
      clearTimeout(this.controlsVisibilityTimer);

    this.setState({
      showControls: true,
    });

    this.controlsVisibilityTimer = setTimeout(() => {
      this.setState({
        showControls: false,
      });
    }, 1500);
  };

  handleMouseOut = () => {
    this.setState({
      showControls: false,
    });
  };

  clickCount = 0;
  clickTimeout;

  handleClick = (e) => {
    e.target.blur();
    clearTimeout(this.clickTimeout);
    this.clickCount += 1;
    this.clickTimeout = setTimeout(() => {
      if (this.clickCount > 1) {
        this.toggleFullscreen();
        console.log(e);
      } else {
        this.togglePause(e);
      }
      this.clickCount = 0;
    }, 200);
  };

  render() {
    return (
      <div style={{ height: '90vh', marginTop: '-20px' }}>
        <div style={{ height: '75%' }}>
          <div
            ref={this.nodeRef}
            onMouseMove={this.handleMouseIn}
            onMouseLeave={this.handleMouseOut}
            className={classes.container}
          >
            {this.state.isFileCreated ? (
              <>
                <ReactMPV
                  className={classes.player}
                  onReady={this.handleMPVReady}
                  onPropertyChange={this.handlePropertyChange}
                  onMouseDown={(e) => this.handleClick(e)}
                  togglePause={this.togglePause}
                />

                <div
                  className={
                    this.state.showControls
                      ? classes.controlsContainer
                      : [
                          classes.controlsContainer,
                          classes.controlsContainerHidden,
                        ].join(' ')
                  }
                >
                  <div className={classes.controls}>
                    <button
                      className={classes.control}
                      onClick={this.togglePause}
                    >
                      {this.state.pause ? '▶' : '❚❚'}
                    </button>
                    <button
                      className={classes.control}
                      onClick={this.handleStop}
                    >
                      ■
                    </button>
                    <span className={classes.time}>
                      {this.state.currentTime}
                    </span>
                    <input
                      className={classes.seek}
                      type="range"
                      min={0}
                      step={0.1}
                      max={this.state.duration}
                      value={this.state['time-pos']}
                      onChange={this.handleSeek}
                      onMouseDown={this.handleSeekMouseDown}
                      onMouseUp={this.handleSeekMouseUp}
                    />
                    <span className={classes.time}>
                      {this.state.durationStamp}
                    </span>
                    <button
                      className={classes.control}
                      onClick={this.handleLoad}
                    >
                      ⏏
                    </button>
                    <button
                      className={classes.control}
                      onClick={this.handleFullScreenToggle}
                    >
                      full
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
        <div className={classes.showInfo}>
          {this.props.location.state && this.props.location.state.epTitle}
        </div>
      </div>
    );
  }
}

export default withRouter(Renderer);
