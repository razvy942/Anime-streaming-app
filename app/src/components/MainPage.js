import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axiosInstance from '../helpers/axiosGlobal';
import axios from 'axios';

import AnimeContainer from './UI/AnimeContainer/AnimeContainer';
import Placeholder from './UI/Placeholders/MainPage';
import Button from './UI/Button/Button';
import Spinner from './UI/Spinners/Spinner';
import classes from './MainPage.module.css';

const MainPage = ({ isHomePage, isAllShows }) => {
  //const axios = axiosInstance.get();

  const params = useParams();
  const history = useHistory();
  const baseURL = 'http://localhost:5000/api';

  const [allShows, setAllShows] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(params.page));
  const [errors, setErrors] = useState(undefined);

  let url = `${baseURL}/get-all/${currentPage}`;
  if (isHomePage) url = `${baseURL}/get-airing`;

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios
      .get(url, { cancelToken: source.token })
      .then((res) => {
        console.log(res.data);
        setAllShows(res.data);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Canceled request');
        } else {
          console.log(`Error fetching shows ${err}`);
          setErrors(err);
        }
      });

    return () => source.cancel();
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
    <div className={classes.mainPage}>
      <div style={{ height: '80px' }}></div>
      {errors ? (
        <div>there was an error sorry, please try again later</div>
      ) : (
        <>
          <h1>{isHomePage ? 'Currently Airing' : 'All Shows'} </h1>
          <div className={classes.container}>
            {allShows ? (
              Object.keys(allShows).map((show, index) => {
                return (
                  <div key={index}>
                    <AnimeContainer
                      horribleTitle={show}
                      info={allShows[show]}
                    />
                  </div>
                );
              })
            ) : (
              // <Spinner />
              <Placeholder components={15} />
            )}
          </div>
          {isAllShows && paginationElement}
        </>
      )}
    </div>
  );
};

export default MainPage;
