import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const Provider = (props) => {
  const [videoPath, setVideoPath] = useState({
    fromRedirect: false,
    filePath: undefined,
  });

  return (
    <UserContext.Provider value={[videoPath, setVideoPath]}>
      {props.children}
    </UserContext.Provider>
  );
};
