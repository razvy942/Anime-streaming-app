import React from 'react';

/**
 * The MIME type associated with mpv.js plugin.
 */
const PLUGIN_MIME_TYPE = 'application/x-mpvjs';

class ReactMPV extends React.Component {
  state = {
    tracks: {},
  };

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

    console.log(this.tracksObj);
    this.command('keypress', key);
  }

  fullscreen() {
    this.node().webkitRequestFullscreen();
  }

  destroy() {
    this.node().remove();
  }

  plugin = React.createRef();

  node() {
    //return this.refs.plugin;
    return this.plugin.current;
  }

  _postData(type, data) {
    const msg = { type, data };
    this.node().postMessage(msg);
  }

  tracksObj = {
    sub: {},
    audio: {},
    video: {},
  };

  _handleMessage(e) {
    const msg = e.data;

    if (msg.data) {
      if (msg.data.name.match(/track-list\/\d+/g)) {
        let tokens = msg.data.name.split('/');
        if (tokens[2] === 'type') {
          this.tracksObj[msg.data.value][tokens[1]] = [];
        } else {
          this.tracksObj[tokens[2]][tokens[1]].push(msg.data.value);
        }
      }
    }

    if (msg.data && msg.data.name !== 'time-pos') console.log(msg);
    const { type, data } = msg;

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
      }
    }

    if (type === 'property_change' && this.props.onPropertyChange) {
      const { name, value } = data;
      this.props.onPropertyChange(name, value);
    } else if (type === 'ready' && this.props.onReady) {
      this.props.onReady(this);
    }
  }

  componentDidMount() {
    this.node().addEventListener('message', this._handleMessage.bind(this));
  }

  render() {
    return (
      <div style={{ height: this.props.playerHeight, width: '100%' }}>
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
