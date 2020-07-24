import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDarkTheme(true);
    }
  }, [darkTheme]);

  const handleSearchPost = (e) => {
    e.preventDefault();
    let url = `http://localhost:5000/api/search/${searchTerm}`;
    axios
      .post(url)
      .then((res) => {
        // push to main page with results
        console.log(res.data);
      })
      .catch((err) => {
        console.log(`err: ${err}`);
      });
  };

  const onChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const createNewWindow = () => {
    const BrowserWindow = remote.BrowserWindow;
    const win = new BrowserWindow({
      height: 600,
      width: 800,
    });

    win.loadURL('http://localhost:3000/all-shows/1');
  };

  return (
    <>
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

        <form className={classes.searchBox} onSubmit={handleSearchPost}>
          <input
            className={classes.searchInput}
            placeholder="Search for something to watch"
            value={searchTerm}
            onChange={onChangeSearch}
            onSubmit={handleSearchPost}
          ></input>
        </form>

        <div className={classes.profile}>
          <Button clickAction={handleShow} text={'Login'} />
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '10px',
            }}
          >
            <Slider switchThemes={switchThemes} isActive={darkTheme} />

            {modal}
          </span>
        </div>
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
    </>
  );
};

export default NavBar;
