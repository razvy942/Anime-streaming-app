const rp = require('request-promise');
const $ = require('cheerio');

let url = 'https://nyaa.si';

// global variable holding the info about episodes
let newLinks = { HorribleSubs: {} };

/* Main method, this runs whenver the /get-links path recives a request */
module.exports.scrapeLinks = (req, res, next) => {
	if (req.query.page) {
		url = `https://nyaa.si/?p=${req.query.page}`;
	} else if (req.query.search) {
		url = `https://nyaa.si/?q=${req.query.search}`;
	} else {
		url = 'https://nyaa.si/';
	}

	// nyaa returns a gzipped page, it needs to be unzipped before it gets scraped
	const opts = {
		url,
		gzip: true
	};

	newLinks = { HorribleSubs: {} };

	rp(opts)
		.then(html => {
			let links = $('tbody tr td > a', html);
			let animeLinks = createLinks(links);
			createData(animeLinks);
			res.json(newLinks);
		})
		.catch(err => {
			console.log('Sorry something went wrong');
		});
};

/****************************************** Helper Methods ***************************************************/

/* Parses and returns the title of the show followed by the episode */
const parseTitle = epInfo => {
	title = epInfo
		.split(']')
		.slice(1)
		.join()
		.split('[')[0]
		.split('-');

	return title;
};

/* Returns tags the contain info about the show */
const getTags = epInfo => {
	// this will return the tags [subs][resolution]
	tags = epInfo.match(/\[.*?\]/g);
	// return array of tags without the square brackets
	tags = tags
		.join(' ')
		.split('[')
		.join(' ')
		.split(']');
	// now we have an array with all the tags
	tags.splice(tags.length - 1);
	return tags;
};

/* This creates and object that has keys for every episode, and every key contains an array with the /view, /download and magnet links */
const createLinks = links => {
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

	for (let anime in animeLinks) {
		if (
			animeLinks[anime].length == 0 ||
			new RegExp('batch', 'i').test(anime) ||
			!anime.startsWith('[HorribleSubs]')
		) {
			delete animeLinks[anime];
		}
	}

	return animeLinks;
};

/* This creates the global database that contains all the episodes and the download links */
const createData = animeLinks => {
	let epLinks = {}; // e.g 05: resLinks
	let resLinks = {}; // e.g 1080p: link

	for (let anime in animeLinks) {
		const parsedTitle = parseTitle(anime);
		let episodeTitle = parsedTitle.slice(0, parsedTitle.length - 1).join();

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
};
