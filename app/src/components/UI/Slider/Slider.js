import React from 'react';

import classes from './Slider.module.css';

const Slider = ({ switchThemes, isActive }) => {
  return (
    <div className={classes.themeSwitchWrapper}>
      <label className={classes.themeSwitch} htmlFor='checkbox'>
        <input
          type='checkbox'
          id='checkbox'
          onClick={switchThemes}
          defaultChecked={isActive}
        />
        <div className={[classes.slider, classes.round].join(' ')}></div>
      </label>
    </div>
  );
};

export default Slider;
