import path from 'path';
import React from 'react';
import ReactMPV from '../../helpers/MPV';
import { remote } from 'electron';
import classes from './Player.module.css';
import { withRouter } from 'react-router-dom';
import fs from 'fs';

import VideoControls from './VideoControls';
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
    controlsTime: 3000,
    volume: 100,
    leftMargin: '0px',
  };

  mpv = null;
  nodeRef = React.createRef();

  fileCheckerInterval;
  createTimeStampInterval;
  controlsVisibilityTimer;
  mouseVisibilityTimer;
  clickCount = 0;
  clickTimeout;

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

    if (hours === 0) {
      hours = '';
    } else if (hours.toString().length < 2) {
      hours = `0${hours}:`;
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
        durationStamp: `${hours}${minutes}:${seconds}`,
      });
    } else {
      this.setState({
        currentTime: `${hours}${minutes}:${seconds}`,
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
      console.log('file was found');
      clearInterval(this.fileCheckerInterval);
      this.setState({
        isFileCreated: true,
      });
    });
  };

  centerControls = () => {
    let innerWidth = window.innerWidth;
    console.log(innerWidth);
    let leftMargin = (innerWidth - 600) / 2;

    this.setState({
      leftMargin: leftMargin,
    });
  };

  componentDidMount() {
    //document.addEventListener('keydown', this.handleKeyDown, false);
    this.centerControls();
    window.addEventListener('resize', this.centerControls);
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
    // document.removeEventListener('keydown', this.handleKeyDown, false);
    window.removeEventListener('resize', this.centerControls);
    clearInterval(this.fileCheckerInterval);
    clearInterval(this.createTimeStampInterval);
  }

  handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === 'f' || (e.key === 'Escape' && this.state.fullscreen)) {
      this.toggleFullscreen();
      // } else if (e.key === ' ') {
      //   this.setState({ pause: !this.state.pause });
      //   this.mpv.property('pause', this.state.pause);
    } else if (this.state.duration) {
      this.mpv.keypress(e);
    } else {
      this.mpv.keypress(e);
    }
    // if (e.key === 'i') {
    //   console.log('info');
    //   let info = this.mpv.command('property', 'time-pos');
    //   console.log(info);
    // }
  };

  handleMPVReady = (mpv) => {
    this.mpv = mpv;
    const observe = mpv.observe.bind(mpv);
    [
      'pause',
      'time-pos',
      'duration',
      'eof-reached',
      'video-format',
      'audio-params/channels',
      'track-list/count',
      'ao-volume',
    ].forEach(observe);
    this.mpv.property('hwdec', 'auto');
    //this.mpv.command('loadfile', '.\\vid.mkv');
    let vidPath = '\\vid.mkv';
    if (this.props.location.state) {
      vidPath = this.props.location.state.path;
    }
    this.mpv.command('loadfile', vidPath);
    this.mpv.property('ao-volume', 100);
    setTimeout(() => {
      this.mpv.property('pause', false);
    }, 10);
  };

  handlePropertyChange = (name, value) => {
    if (name === 'time-pos' && this.seeking) {
      return;
    } else if (name === 'eof-reached' && value) {
      if (this.state['time-pos'] === this.state.duration) {
        console.log('buffering');
      } else {
        this.mpv.property('time-pos', 0);
      }
    } else {
      this.setState({ [name]: value });
    }
  };

  toggleFullscreen = () => {
    if (this.state.fullscreen) {
      document.webkitExitFullscreen();
      //remote.getCurrentWindow().unmaximize();
      this.setState({
        fullscreen: false,
      });
    } else {
      this.nodeRef.current.requestFullscreen();
      //remote.getCurrentWindow().maximize();
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
    this.mpv.property('speed', 1);
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
          {
            name: 'Videos',
            extensions: ['mkv', 'webm', 'mp4', 'mov', 'avi', 'flac'],
          },
          { name: 'All files', extensions: ['*'] },
        ],
      })
      .then((res) => {
        if (res.filePaths[0]) this.mpv.command('loadfile', res.filePaths[0]);
      });
  };

  handleMouseIn = () => {
    clearTimeout(this.mouseVisibilityTimer);
    document.body.style.cursor = 'default';
    this.mouseVisibilityTimer = setTimeout(() => {
      document.body.style.cursor = 'none';
    }, 3000);

    if (this.controlsVisibilityTimer)
      clearTimeout(this.controlsVisibilityTimer);

    this.setState({
      showControls: true,
    });

    this.controlsVisibilityTimer = setTimeout(() => {
      this.setState({
        showControls: false,
      });
    }, this.state.controlsTime);
  };

  handleMouseOverControls = () => {
    this.setState({
      controlsTime: 10000,
    });
  };

  handleMouseOutControls = () => {
    this.setState({
      controlsTime: 3000,
    });
  };

  handleMouseOut = () => {
    clearTimeout(this.mouseVisibilityTimer);
    document.body.style.cursor = 'default';
    this.setState({
      showControls: false,
    });
  };

  handleClick = (e) => {
    console.log('hai');
    e.target.blur();
    clearTimeout(this.clickTimeout);
    this.clickCount += 1;
    if (this.clickCount > 1) {
      this.toggleFullscreen();
      console.log(e);
    }

    this.clickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, 200);
  };

  handleVolume = (e) => {
    e.target.blur();
    const volumePos = +e.target.value;
    this.setState({ volume: volumePos });
    this.mpv.property('ao-volume', volumePos);
  };

  rewind = () => {
    this.mpv.property('speed', 0.5);
  };

  advance = () => {
    this.mpv.property('speed', 2);
  };

  render() {
    return (
      <div onKeyDown={this.handleKeyDown}>
        {/* <div style={{ height: '45px' }}></div> */}
        <div className={classes.playerContainer}>
          <div
            onMouseMove={this.handleMouseIn}
            onMouseLeave={this.handleMouseOut}
            className={classes.container}
          >
            {this.state.isFileCreated ? (
              <>
                <div
                  style={{ height: '70vh', width: '100%' }}
                  ref={this.nodeRef}
                  onKeyDown={this.handleKeyDown}
                  onClick={(e) => {
                    e.target.blur();
                    document.addEventListener(
                      'keydown',
                      this.handleKeyDown,
                      false
                    );
                    this.handleClick(e);
                  }}
                  onMouseLeave={() => {
                    document.removeEventListener(
                      'keydown',
                      this.handleKeyDown,
                      false
                    );
                  }}
                >
                  <ReactMPV
                    className={classes.player}
                    onReady={this.handleMPVReady}
                    onPropertyChange={this.handlePropertyChange}
                    onMouseDown={(e) => this.handleClick(e)}
                    playerHeight={this.state.fullscreen ? '100vh' : '70vh'}
                  />

                  <div
                    style={{ left: this.state.leftMargin }}
                    className={
                      this.state.showControls
                        ? classes.controlsContainer
                        : [
                            classes.controlsContainer,
                            classes.controlsContainerHidden,
                          ].join(' ')
                    }
                  >
                    <div
                      onMouseEnter={this.handleMouseOverControls}
                      onMouseLeave={this.handleMouseOutControls}
                      className={classes.controls}
                    >
                      <VideoControls
                        volume={this.state.volume}
                        pause={this.state.pause}
                        currentTime={this.state.currentTime}
                        duration={this.state.duration}
                        durationStamp={this.state.durationStamp}
                        timePos={this.state['time-pos']}
                        handleVolume={this.handleVolume}
                        rewind={this.rewind}
                        togglePause={this.togglePause}
                        advance={this.advance}
                        handleLoad={this.handleLoad}
                        handleFullScreenToggle={this.handleFullScreenToggle}
                        handleSeek={this.handleSeek}
                        handleSeekMouseDown={this.handleSeekMouseDown}
                        handleSeekMouseUp={this.handleSeekMouseUp}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
        <div className={classes.showInfo}>
          {'this.props.location.state && this.props.location.state.epTitle'}
        </div>
      </div>
    );
  }
}

export default withRouter(Renderer);
