import axios from './axios-instance';

export function getMalId(title) {
	return axios
		.get(`https://api.jikan.moe/v3/search/anime?q=${title}&page=1`)
		.then(res => {
			return res.data.results[0].mal_id;
		})
		.catch(err => {
			console.log(`Coudln't get MAL ID's ${err}`);
		});
}
