import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import AnimeContainer from './UI/AnimeContainer/AnimeContainer';
import Button from './UI/Button/Button';
import Spinner from './UI/Spinners/Spinner';
import classes from './MainPage.module.css';

const MainPage = ({ isHomePage, isAllShows }) => {
  const params = useParams();
  const history = useHistory();
  const baseURL = 'http://localhost:5000/horriblesubs';

  const [allShows, setAllShows] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(params.page));

  let url = `${baseURL}/get-all?page=${currentPage}`;
  if (isHomePage) url = `${baseURL}/get-latest`;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        setAllShows(res.data);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      })
      .catch((err) => {
        console.log(`Error fetching shows ${err}`);
      });
  }, [currentPage, url]);

  const changePage = (increment = true) => {
    setAllShows(null);
    if (increment) {
      history.push(`/all-shows/${currentPage + 1}`);
      setCurrentPage(currentPage + 1);
    } else {
      history.push(`/all-shows/${currentPage - 1}`);
      setCurrentPage(currentPage - 1);
    }
  };

  const paginationElement = (
    <div className={classes.pagination}>
      <Button
        isDisabled={currentPage === 1}
        clickAction={() => changePage(false)}
        text={'Previous page'}
      />

      <p>{currentPage}</p>
      <Button text={'Next Page'} clickAction={changePage} />
    </div>
  );

  return (
    <div>
      <h1>{isHomePage ? 'Latest Releases' : 'All Shows'} </h1>
      <div className={classes.container}>
        {allShows ? (
          Object.keys(allShows).map((show, index) => {
            return (
              <div key={index}>
                <AnimeContainer
                  seriesTitle={show}
                  seriesDesc={allShows[show].desc}
                  seriesImage={allShows[show].img}
                />
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
      {isAllShows && paginationElement}
    </div>
  );
};

export default MainPage;
