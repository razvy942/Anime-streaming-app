import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";

import axios from "axios";
import classes from "./CurrentSeason.module.css";

const CurrentSeason = ({ history }) => {
  // use these for pagination
  // TODO: INTRODUCE PAGINATION
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState([1]);
  const [links, setLinks] = useState(null);
  const apiUrl = "https://api.jikan.moe/v3/season";

  const getCurrentSeason = () => {
    setTimeout(() => {
      axios.get(apiUrl).then(data => {
        setLinks(paginateResults(data.data.anime, 20));
      });
    }, 500);
  };

  /** API gives back all the results, we have to split the pages inside the state so we don't
   *  make too many network requests at once
   */
  const paginateResults = (data, pageResults) => {
    const animes = data; // array of objects
    let page = 0;
    let animeObj = {};
    let animeArr = [];

    animes.forEach((anime, index) => {
      if (index % pageResults === 0) {
        page++;
        animeArr = [];
        animeObj[page] = animeArr;
      }
      animeArr.push(animes[index]);
    });
    setPages(page);
    return animeObj;
  };

  const changePage = () => {
    console.log("changing page");
    let currentPage = page[page.length - 1];
    if (currentPage < pages) {
      setPage([...page, currentPage + 1]);
    }
  };

  useEffect(() => {
    getCurrentSeason();
  }, []);

  return (
    <div className={["container", classes.main].join(" ")}>
      {links ? (
        page.map(pg =>
          links[pg].map(link => (
            <Card
              onClick={() => {
                history.push(`/info/${link.mal_id}`);
              }}
              className={["card-spacing", classes.card].join(" ")}
              style={{
                width: "10rem",

                margin: "18px"
              }}
              key={link.mal_id}
            >
              <Card.Img
                variant="top"
                src={link.image_url}
                style={{ width: "100%" }}
              />

              <Card.Title style={{ padding: "10px", textAlign: "center" }}>
                {link.title}
              </Card.Title>
            </Card>
          ))
        )
      ) : (
        <Spinner animation="border" variant="secondary" />
      )}
      {links && <button onClick={changePage}>Load more results</button>}
    </div>
  );
};

export default CurrentSeason;
