import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompress,
  faCompressAlt,
  faTimes,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons';
import { remote } from 'electron';

import Modal from '../Modal';
import Slider from '../Slider/Slider';
import Button from '../Button/Button';
import classes from './style.module.css';

const NavBar = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDarkTheme(true);
    }
  }, [darkTheme]);

  const handleShow = () => {
    setShowModal(true);
  };

  const handleHide = () => {
    setShowModal(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
    }
  };

  const minimizeWindow = () => {
    remote.getCurrentWindow().minimize();
  };

  const maximizeWindow = () => {
    if (!remote.getCurrentWindow().isMaximized()) {
      remote.getCurrentWindow().maximize();
    } else {
      remote.getCurrentWindow().unmaximize();
    }
  };

  const closeWindow = () => {
    remote.app.quit();
  };

  const switchThemes = () => {
    if (!darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDarkTheme(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setDarkTheme(false);
    }
  };

  const modal = showModal ? (
    <Modal>
      <div className={classes.modal}>
        <button onClick={handleHide} className={classes.closeButton}>
          X
        </button>
        <div>INSERT LOGIN FORM HERE</div>

        <button onClick={handleHide}>Hide modal</button>
      </div>
    </Modal>
  ) : null;

  return (
    <nav className={classes.navBar} onKeyDown={(e) => handleKeyPress(e)}>
      <div className={classes.links}>
        <ul>
          <li>
            <NavLink exact activeClassName={classes.active} to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/all-shows/1">
              All shows
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/player">
              Video Player
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/manage-downloads">
              Manage Downloads
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={classes.searchBox}>
        <input
          className={classes.searchInput}
          placeholder="Search for something to watch"
        ></input>
      </div>
      {/* <div className={classes.profile}>
        <Button clickAction={handleShow} text={'Login'} />
        <span
          style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
        >
          <Slider switchThemes={switchThemes} isActive={darkTheme} />

          {modal}
        </span>
      </div> */}
      {/* <div className={classes.windowOptions}>
        <button onClick={minimizeWindow} className={classes.windowControl}>
          <FontAwesomeIcon size="md" icon={faWindowMinimize} />
        </button>
        <button onClick={maximizeWindow} className={classes.windowControl}>
          <FontAwesomeIcon size="md" icon={faCompress} />
        </button>
        <button
          onClick={closeWindow}
          className={[classes.windowControl, classes.windowClose].join(' ')}
        >
          <FontAwesomeIcon size="md" icon={faTimes} />
        </button>
      </div> */}
    </nav>
  );
};

export default NavBar;
