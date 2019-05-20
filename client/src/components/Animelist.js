import React, { Component } from "react";

import "./Animelist.css";
import axios from "../axios-instance";

export default class Animelist extends Component {
  state = { links: null, currentSearch: "" };

  componentDidMount = () => {
    this.getLinks("");
  };

  getLinks = val => {
    this.setState({ links: null });
    axios
      .get(`api/get-links${val}`)
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

  addMagnetClickHandler = (magnet, title) => {
    console.log(title);
    axios
      .get(`add/${magnet}`)
      .then(this.props.history.push(`/watch/${title.split(" ")[0]}`));
  };

  handleSearch = e => {
    e.preventDefault();
    this.getLinks(`?search=[HorribleSubs] ${this.state.currentSearch}`);
  };

  handleSearchInput = e => {
    this.setState({
      currentSearch: e.target.value
    });
  };

  render() {
    return (
      <>
        <nav className="nav-bar">
          <form>
            <input
              placeholder="Type the name of the show "
              value={this.state.currentSearch}
              onChange={this.handleSearchInput}
            />
            <button onClick={this.handleSearch} type="submit">
              Search
            </button>
          </form>
          <ul>
            <li className="btn">New Releases</li>
            <li className="btn">All shows</li>
          </ul>
        </nav>
        <div className="container">
          {this.state.links ? (
            Object.keys(this.state.links).map(key => {
              return (
                <ul className="ep-box" key={key}>
                  <p className="ep-title">{key}</p>
                  {Object.keys(this.state.links[key]).map(ep => {
                    let fullHD;
                    let HD;
                    try {
                      fullHD = this.state.links[key][ep]["1080p"][2];
                    } catch (err) {
                      fullHD = "No data found";
                    }

                    try {
                      HD = this.state.links[key][ep]["720p"][2];
                    } catch (err) {
                      HD = "No data found";
                    }

                    return (
                      <>
                        <li
                          className="btn"
                          onClick={() =>
                            this.addMagnetClickHandler(fullHD, key)
                          }
                          key={key + ep + "-1080p"}
                        >
                          {ep}: 1080p: click here to watch
                        </li>
                        <li
                          className="btn"
                          onClick={() => this.addMagnetClickHandler(HD, key)}
                          key={key + ep + "-720p"}
                        >
                          {ep}: 720p: click here to watch
                        </li>
                      </>
                    );
                  })}
                </ul>
              );
            })
          ) : (
            <p>Loading</p>
          )}
        </div>
      </>
    );
  }
}
