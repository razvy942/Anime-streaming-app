import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import axios from "../axios-instance";

export default class Animelist extends Component {
  state = { links: null, isVideoReady: false };

  componentDidMount = () => {
    axios
      .get("api/get-links?page=6")
      .then(data => {
        console.log(data);
        this.setState({
          links: data.data.HorribleSubs
        });
      })
      .catch(err => {
        console.log("Error fetching links");
      });
  };

  addMagnetClickHandler = magnet => {
    console.log(magnet);
    axios.get(`add/${magnet}`).then(res => console.log("Magnet added"));
  };

  render() {
    return (
      <>
        {this.state.links ? (
          Object.keys(this.state.links).map(key => {
            return (
              <li key={key}>
                {key}
                {Object.keys(this.state.links[key]).map(ep => {
                  //let fullHD = this.state.links[key][ep]["1080p"][2];
                  let HD = this.state.links[key][ep]["720p"][2];
                  return (
                    <>
                      <NavLink
                        onClick={() => this.addMagnetClickHandler(HD)}
                        key={ep + "1080p"}
                        to="/watch"
                      >
                        <div>{ep}: 1080p: click here to add to download</div>
                      </NavLink>
                      <NavLink
                        onClick={() => this.addMagnetClickHandler(HD)}
                        key={ep + "720p"}
                        to="/watch"
                      >
                        <div>{ep}: 720p: lick here to add to download</div>
                      </NavLink>
                    </>
                  );
                })}
              </li>
            );
          })
        ) : (
          <p>Loading</p>
        )}
      </>
    );
  }
}
