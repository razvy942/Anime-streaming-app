const rp = require('request-promise');
const $ = require('cheerio');

// TODO: get params in order to perform different searches on nyaa
const url = 'https://nyaa.si/?f=0&c=0_0&q=%5BHorribleSubs%5D+shingeki';

const opts = {
	url,
	gzip: true
};

let newLinks = { HorribleSubs: {} };

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
						) {
							let prefix;
							prefix =
								links[link].attribs.href.startsWith('/view') ||
								links[link].attribs.href.startsWith('/download')
									? 'https://nyaa.si'
									: '';
							ah.push(prefix + links[link].attribs.href);
						}
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

			//let newLinks = { HorribleSubs: {} }; // HorribleSubs: epLinks
			let epLinks = {}; // e.g 05: resLinks
			let resLinks = {}; // e.g 1080p: link

			for (let anime in animeLinks) {
				const parsedTitle = parseTitle(anime);
				let episodeTitle = parsedTitle
					.slice(0, parsedTitle.length - 1)
					.join();

				// sometimes batches of episodes are posted, these do not need to be put inside the obj
				if (episodeTitle.length == 0) {
					//episodeTitle = 'Batches';
					continue;
				}
				const episodeNumber = parsedTitle[parsedTitle.length - 1];
				const [subProvider, resolution] = getTags(anime);

				if (!(episodeTitle.trim() in newLinks.HorribleSubs)) {
					// if this is a new entry, empty out both objects
					epLinks = {};
					resLinks = {};
					// otherwise retrieve the existing episode links, and only empty out the resolutions objects
					// on each pass
				} else if (episodeTitle.trim() in newLinks.HorribleSubs) {
					epLinks = newLinks.HorribleSubs[episodeTitle.trim()];
					if (resolution.trim() == '1080p') {
						resLinks = {};
					}
				}

				resLinks[resolution.trim()] = animeLinks[anime];
				epLinks[episodeNumber.trim()] = resLinks;
				newLinks[subProvider.trim()][episodeTitle.trim()] = epLinks;
			}
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
