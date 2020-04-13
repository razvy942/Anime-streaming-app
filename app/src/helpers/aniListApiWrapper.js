import axios from 'axios';

const url = 'https://graphql.anilist.co';
const options = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function getInfo(title, modifyState) {
  const query = `
query ($id: Int, $search: String) {
    Media (id: $id, search: $search) {
      id
      title {
        romaji
        english
        native
      }
      episodes
      description(asHtml: false)
      startDate {
        year
        month
      }
      season
      seasonYear
      bannerImage
      coverImage {
        large
        medium
      }
      averageScore      
  }
}
`;

  const variables = {
    search: title,
  };

  axios({
    method: 'POST',
    url: url,
    data: JSON.stringify({ query, variables }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then((res) => {
    console.log(res.data.data.Media);
    modifyState(res.data.data.Media);
  });
}

export default {
  getInfo,
};
