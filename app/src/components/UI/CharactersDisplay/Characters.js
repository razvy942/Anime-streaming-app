import React from 'react';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import classes from './Characters.module.css';

export default function Characters({ showInfo }) {
  return (
    <div className={classes.charactersDisplay}>
      <h1 style={{ textAlign: 'start', marginBottom: '10px' }}>Characters</h1>
      {/* <div className={classes.charactersDisplay}> */}
      <Carousel
        slidesPerPage={10}
        animationSpeed={500}
        keepDirectionWhenDragging
      >
        {showInfo.characters.map((character, index) => (
          <div key={index} className={classes.characterDisplay}>
            <img
              className={classes.characterPortrait}
              src={character['image_url']}
              alt={`Portrait of ${character.name}`}
            />
            <div>
              <span>{character.name}</span>
              <br />
              <span>
                {character['voice_actors'].map(
                  (i, index) =>
                    i.language === 'Japanese' && (
                      <span style={{ fontSize: '0.8rem' }} key={index}>
                        {i.name}
                      </span>
                    )
                )}
              </span>
            </div>
          </div>
        ))}
      </Carousel>
      {/* </div> */}
    </div>
  );
}
