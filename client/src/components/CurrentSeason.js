import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Button,
  Paper
} from "@material-ui/core";

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
    <div className={[classes.main].join(" ")}>
      {links ? (
        page.map(pg =>
          links[pg].map(link => (
            <Card
              onClick={() => {
                history.push(`/info/${link.mal_id}`);
              }}
              className={classes.card}
              key={link.mal_id}
            >
              <CardMedia
                title="anime"
                image={link.image_url}
                className={classes.media}
              />
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h6" component="p">
                  {link.title}
                </Typography>
              </CardContent>
            </Card>
          ))
        )
      ) : (
        <div
          style={{
            marginTop: "50vh"
          }}
        >
          <CircularProgress />
        </div>
      )}
      {links && <button onClick={changePage}>Load more results</button>}
    </div>
  );
};

export default CurrentSeason;
