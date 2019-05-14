import React, { Component } from "react";

import axios from "../axios-instance";

export default class Animelist extends Component {
    state = { links: null };

    componentDidMount = () => {
        axios
            .get("api/get-links")
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

    render() {
        let links = <p>Loading...</p>;
        if (this.state.links) {
            links = Object.keys(this.state.links).map(key => {
                return (
                    <li key={key}>
                        {key}
                        {Object.keys(this.state.links[key]).map(ep => {
                            return (
                                <ul key={ep}>
                                    {ep}:{" "}
                                    {this.state.links[key][ep]["1080p"][2]}
                                </ul>
                            );
                        })}
                        )
                    </li>
                );
            });
        }
        return <div>{links}</div>;
    }
}
