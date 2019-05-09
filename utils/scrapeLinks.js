const rp = require('request-promise');
const $ = require('cheerio');

// TODO: get params in order to perform different searches on nyaa
const url = 'https://nyaa.si/?p=3';

const opts = {
	url,
	gzip: true
};

module.exports.scrapeLinks = (req, res, next) => {
	rp(opts)
		.then(html => {
			let links = $('tbody tr td > a', html);

			let animeLinks = {};
			let title;
			let ah = [];

			for (let link in links) {
				//ah = [];
				if (links[link].attribs) {
					if ('title' in links[link].attribs) {
						// Whenever there is a new title, the array with all the links gets emptied

						ah = [];
						title = links[link].attribs.title;
					}
					if ('href' in links[link].attribs) {
						// purshing the magnet, download, and view links into the array
						if (
							links[link].attribs.href.startsWith('/view') ||
							links[link].attribs.href.startsWith('/download') ||
							links[link].attribs.href.startsWith('magnet')
						)
							ah.push(links[link].attribs.href);
					}
				}
				animeLinks[title] = ah;
			}
			//console.log(animeLinks);
			for (let anime in animeLinks) {
				if (
					animeLinks[anime].length == 0 ||
					!anime.startsWith('[Horr')
				) {
					delete animeLinks[anime];
				}
			}
			let newLinks = { HorribleSubs: {} }; // HorribleSubs: epLinks
			let epLinks = {}; // e.g 05: resLinks
			let resLinks = {}; // e.g 1080p: link
			for (let anime in animeLinks) {
				const [episodeTitle, episodeNumber] = parseTitle(anime);
				console.log(episodeNumber);
				const [subProvider, resolution] = getTags(anime);

				resLinks[resolution.trim()] = animeLinks[anime];
				epLinks[episodeNumber.trim()] = resLinks;
				newLinks[subProvider.trim()][episodeTitle.trim()] = epLinks;
			}
			//console.log(animeLinks);
			res.json(newLinks);
		})
		.catch(err => {
			console.log('Sorry something went wrong');
		});
};

const parseTitle = epInfo => {
	title = epInfo
		.split(']')
		.slice(1)
		.join()
		.split('[')[0]
		.split('-');
	return title;
};

const getTags = epInfo => {
	tags = epInfo.match(/\[.*?\]/g); // this will return the tags [subs][resolution]
	// return array of tags without the square brackets
	tags = tags
		.join(' ')
		.split('[')
		.join(' ')
		.split(']');
	tags.splice(tags.length - 1); // now we have an array with all the tags
	return tags;
};
