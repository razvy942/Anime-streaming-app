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
    duration: 0,
    fullscreen: false,
    isFileCreated: false,
    showControls: false,
  };

  mpv = null;
  fileCheckerInterval;

  checkForFile = () => {
    if (this.state.isFileCreated) return;
    console.log('checking for file');
    if (!this.props.location.state) {
      console.log('no file specified');
      clearInterval(this.fileCheckerInterval);
      this.setState({
        isFileCreated: true,
      });
      return;
    }
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

  doesFileExist = (fileName) => {
    fs.access(fileName, (err) => {
      if (err) return false;
    });
    return true;
  };

  checkForFileb = () => {
    console.log('checking for file');
    if (!this.props.location.state) {
      console.log('no file specified');
      this.setState({
        isFileCreated: true,
      });
      return;
    }

    let fileExists = this.doesFileExist(this.props.location.state.path);

    while (!fileExists) {
      console.log('still checking');
      fileExists = this.doesFileExist(this.props.location.state.path);
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    console.log(path.join(__dirname, '.'));
    console.log(this.props);

    this.fileCheckerInterval = setInterval(() => {
      this.checkForFile();
    }, 2000);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    clearInterval(this.fileCheckerInterval);
  }

  handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === 'f' || (e.key === 'Escape' && this.state.fullscreen)) {
      this.toggleFullscreen();
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
    e.target.blur();
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

  // handleFullScreen = () => {
  //   if (this.state.fullscreen) {
  //     document.webkitExitFullscreen();
  //     this.setState({
  //       fullscreen: false,
  //     });
  //   } else {
  //     this.nodeRef.current.webkitRequestFullscreen();
  //     this.setState({
  //       fullscreen: true,
  //     });
  //   }
  // };

  render() {
    return (
      <div
        ref={this.nodeRef}
        onKeyDown={this.handleKeyDown}
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
              onMouseDown={this.togglePause}
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
                <button className={classes.control} onClick={this.togglePause}>
                  {this.state.pause ? '▶' : '❚❚'}
                </button>
                <button className={classes.control} onClick={this.handleStop}>
                  ■
                </button>
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
                <button className={classes.control} onClick={this.handleLoad}>
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
    );
  }
}

export default withRouter(Renderer);
