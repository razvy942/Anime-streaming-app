import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompress,
  faPlay,
  faPause,
  faFolderOpen,
  faForward,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

import classes from './VideoControls.module.css';

export default function VideoControls({
  volume,
  pause,
  currentTime,
  duration,
  durationStamp,
  timePos,
  handleVolume,
  rewind,
  togglePause,
  advance,
  handleLoad,
  handleFullScreenToggle,
  handleSeek,
  handleSeekMouseDown,
  handleSeekMouseUp,
}) {
  return (
    <div>
      <div className={classes.upper}>
        <div className={classes.audioControls}>
          <span className={classes.audioControl}>
            <FontAwesomeIcon
              size="xs"
              icon={
                volume > 0
                  ? volume > 50
                    ? faVolumeUp
                    : faVolumeDown
                  : faVolumeMute
              }
            />
          </span>
          <input
            className={classes.volumeSeek}
            type="range"
            min={0}
            step={0.1}
            max={100}
            value={volume}
            onChange={handleVolume}
          />
        </div>
        <div className={classes.playbackControls}>
          <button
            className={[classes.control, classes.speedControl].join(' ')}
            onClick={rewind}
          >
            <FontAwesomeIcon size="xs" flip="horizontal" icon={faForward} />
          </button>
          <button
            className={[classes.control, classes.pauseControl].join(' ')}
            onClick={togglePause}
          >
            {pause ? (
              <FontAwesomeIcon size="1x" icon={faPlay} />
            ) : (
              <FontAwesomeIcon size="1x" icon={faPause} />
            )}
          </button>
          <button
            className={[classes.control, classes.speedControl].join(' ')}
            onClick={advance}
          >
            <FontAwesomeIcon size="xs" icon={faForward} />
          </button>
        </div>
        <div className={classes.miscControls}>
          <button className={classes.control} onClick={handleLoad}>
            <FontAwesomeIcon size="xs" icon={faFolderOpen} />
          </button>
          <button className={classes.control} onClick={handleFullScreenToggle}>
            <FontAwesomeIcon size="xs" icon={faCompress} />
          </button>
          <button className={classes.control} onClick={handleFullScreenToggle}>
            <FontAwesomeIcon size="xs" icon={faCog} />
          </button>
        </div>
      </div>
      <div className={classes.lower}>
        <span className={classes.time}>{currentTime}</span>
        <input
          className={classes.seek}
          type="range"
          min={0}
          step={0.1}
          max={duration}
          value={timePos}
          onChange={handleSeek}
          onMouseDown={handleSeekMouseDown}
          onMouseUp={handleSeekMouseUp}
        />
        <span className={classes.time}>{durationStamp}</span>
      </div>
    </div>
  );
}
