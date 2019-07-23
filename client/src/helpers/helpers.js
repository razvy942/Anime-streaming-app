import axios from '../axios-instance';

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

export function getNyaaLinks(title) {
	const searchQuery = `?search=[HorribleSubs] ${title}`;
	return axios
		.get(`/get-links${searchQuery}`)
		.then(data => {
			return data.data.HorribleSubs;
		})
		.catch(err => {
			return err;
		});
}

export function getLinks(title) {
	return axios
		.get(`https://api.jikan.moe/v3/search/anime?q=${title}`)
		.then(data => {
			return { anime: data.data.results };
		})
		.catch(err => {
			return err;
		});
}
