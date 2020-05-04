import React from 'react';

/**
 * The MIME type associated with mpv.js plugin.
 */
const PLUGIN_MIME_TYPE = 'application/x-mpvjs';

class ReactMPV extends React.Component {
  state = {
    tracks: {},
  };

  plugin = React.createRef();

  command(cmd, ...args) {
    args = args.map((arg) => arg.toString());
    this._postData('command', [cmd].concat(args));
  }

  property(name, value) {
    const data = { name, value };
    this._postData('set_property', data);
  }

  observe(name) {
    this._postData('observe_property', name);
  }

  keypress({ key, shiftKey, ctrlKey, altKey }) {
    console.log('keyed');
    // Don't need modifier events.
    if (
      [
        'Escape',
        'Shift',
        'Control',
        'Alt',
        'Compose',
        'CapsLock',
        'Meta',
      ].includes(key)
    )
      return;

    if (key.startsWith('Arrow')) {
      key = key.slice(5).toUpperCase();
      if (shiftKey) {
        key = `Shift+${key}`;
      }
    }
    if (ctrlKey) {
      key = `Ctrl+${key}`;
    }
    if (altKey) {
      key = `Alt+${key}`;
    }

    // Ignore exit keys for default keybindings settings.
    if (
      [
        'q',
        'Q',
        'ESC',
        'POWER',
        'STOP',
        'CLOSE_WIN',
        'CLOSE_WIN',
        'Ctrl+c',
        'AR_PLAY_HOLD',
        'AR_CENTER_HOLD',
      ].includes(key)
    )
      return;

    // this.observe('track-list/count');
    // this.observe('ao-volume');
    this.observe('cursor-autohide');
    console.log(this.tracksObj);
    this.command('keypress', key);
  }

  fullscreen() {
    this.node().webkitRequestFullscreen();
  }

  destroy() {
    this.node().remove();
  }

  node() {
    //return this.refs.plugin;
    return this.plugin.current;
  }

  _postData(type, data) {
    const msg = { type, data };
    this.node().postMessage(msg);
  }

  _handleMessage(e) {
    const msg = e.data;
    const { type, data } = msg;
    if (msg.data && msg.data.name !== 'time-pos') console.log(msg);

    if (data) {
      this.getTracks(data);
      this.parseTrackInfo(data);
    }

    if (type === 'property_change' && this.props.onPropertyChange) {
      const { name, value } = data;
      this.props.onPropertyChange(name, value);
    } else if (type === 'ready' && this.props.onReady) {
      this.props.onReady(this);
    }
  }

  getTracks(data) {
    if (data && data.name === 'track-list/count') {
      this.tracksObj = {
        sub: {},
        audio: {},
        video: {},
      };
      let tracks = data.value;
      for (let i = 0; i < tracks; i++) {
        this.observe(`track-list/${i}/type`);
        this.observe(`track-list/${i}/title`);
        this.observe(`track-list/${i}/lang`);
        this.observe(`track-list/${i}/selected`);
      }
    }
  }

  // 1: sub, 2:sub, 3:audio, ...
  trackMapping = {};
  tracksObj = {
    sub: {},
    audio: {},
    video: {},
  };

  parseTrackInfo(data) {
    if (data.name.match(/track-list\/\d+\/type/g)) {
      let tokens = data.name.split('/');
      let trackNum = tokens[1];
      // audio, sub, video
      let value = data.value;
      // Create empty object to add tracks to
      if (!this.tracksObj[value][trackNum]) {
        let valObj = {
          title: undefined,
          language: undefined,
        };
        this.tracksObj[value][trackNum] = valObj;
      }
      this.trackMapping[trackNum] = value;
    }

    if (data.name.match(/track-list\/\d+\/title/g)) {
      this._parseTrackInfoHelper(data, 'title');
    }

    if (data.name.match(/track-list\/\d+\/lang/g)) {
      this._parseTrackInfoHelper(data, 'language');
    }

    if (data.name.match(/track-list\/\d+\/selected/g)) {
      this._parseTrackInfoHelper(data, 'selected');
    }
  }

  _parseTrackInfoHelper(data, type) {
    let tokens = data.name.split('/');
    let trackNum = tokens[1];
    let value = data.value;
    try {
      this.tracksObj[this.trackMapping[trackNum]][trackNum][type] = value;
    } catch (err) {
      console.error(`Error parsing tracks...${err}`);
    }
  }

  componentDidMount() {
    this.node().addEventListener('message', this._handleMessage.bind(this));
    this.observe('track-list/count');
  }

  render() {
    return (
      <div
        style={{
          height: this.props.playerHeight,
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <embed
          style={{ height: '100%', width: '100%' }}
          type={PLUGIN_MIME_TYPE}
          ref={this.plugin}
        />
      </div>
    );
  }
}

export default ReactMPV;
