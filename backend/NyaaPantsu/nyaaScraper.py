import requests
import re
from bs4 import BeautifulSoup
import pprint

from NyaaPantsu import nyaasi

class NyaaScraper:
    def __init__(self):
        self.url = 'https://nyaa.si/?q=' 
        self.opts = '&s=seeders&o=desc'

    def search(self, query):
        url = f'{self.url}{query}{self.opts}'
        res = requests.get(url)
        if not res.status_code == requests.codes.ok:
            return False
        soup = BeautifulSoup(res.content, features='lxml')
        torrents = soup.findAll('tr', {'class': 'success'})

        search_results = []
        for torrent in torrents:
            info = torrent.select('td', { 'class': 'text-center' })
            img = info[0].select('img')
            img_desc = img[0].get('alt', 'null')
            
            if not img_desc == 'Anime - English-translated':
                pass
            
            title_info = info[1].select('a')
            if len(title_info) > 1:
                title = title_info[1].get('title', 'null')
            else:
                title = title_info[0].get('title', 'null')
            # title can then be run through the parser from nyaasi to extract relevant info
            magnet = ''
            torrent_links = info[2].select('a')
            for torrent_link in torrent_links:
                link = torrent_link.get('href', 'null')
                if link.startswith('magnet'):
                    magnet = link
            file_size = info[3].text
            date_upload = info[4].text
            seeders = info[5].text
            
            info_obj = {
                'title': title,
                'magnet': magnet,
                'size': file_size,
                'uploaded on': date_upload,
                'seeders': seeders
            }

            #pprint.pprint(info_obj)
            search_results.append(info_obj)

        return search_results
        #print(links)

if __name__ == '__main__':
    scraper = NyaaScraper()
    nyaaParser = nyaasi.NyaaSi()
    results = []
    try:
        results = scraper.search('Kono Subarashii Sekai ni Shukufuku wo! 01')
    except:
        print('you dun goofed')

    for result in results:
        title = nyaaParser.parse(result['title'])
        print(title)

    pprint.pprint(results[0])
    