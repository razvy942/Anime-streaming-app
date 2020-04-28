import { createHashHistory } from 'history';

let history = null;

export default {
  init: () => (history = createHashHistory()),
  get: () => {
    if (!history) {
      history = createHashHistory();
    }
    return history;
  },
};
