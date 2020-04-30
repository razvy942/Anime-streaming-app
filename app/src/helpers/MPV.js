import React from 'react';

/**
 * The MIME type associated with mpv.js plugin.
 */
const PLUGIN_MIME_TYPE = 'application/x-mpvjs';

class ReactMPV extends React.Component {
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

    let res = this._postData('observe_property', 'path');
    console.log(res);
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

  _handleMessage(e) {
    const msg = e.data;
    console.log(msg);
    const { type, data } = msg;

    let tracks;
    if (data && data.name === 'track-list/count') tracks = data.value;
    for (let i = 0; i < tracks; i++) {
      this.observe(`track-list/${i}/type`);
      this.observe(`track-list/${i}/title`);
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
      <div
      //onMouseDown={(e) => e.target.blur()}
      //onKeyDown={this.props.handleKeyDown}
      >
        <embed
          style={{ height: this.props.playerHeight, width: '100%' }}
          type={PLUGIN_MIME_TYPE}
          ref={this.plugin}
        />
      </div>
    );
  }
}

export default ReactMPV;
