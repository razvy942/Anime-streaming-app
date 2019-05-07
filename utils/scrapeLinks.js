const rp = require('request-promise');
const $ = require('cheerio');

// TODO: get params in order to perform different searches on nyaa
const url = 'https://nyaa.si';

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
                if (animeLinks[anime].length == 0) {
                    delete animeLinks[anime];
                }
            }
            res.json(animeLinks);
        })
        .catch(err => {
            console.log('Sorry something went wrong');
        });
};
