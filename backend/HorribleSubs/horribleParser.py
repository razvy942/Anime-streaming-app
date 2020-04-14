from bs4 import BeautifulSoup
import requests
from enum import Enum
import pprint
import json

#from HorribleSubs import dynamicLoading
from ApiBindings import kitsu


TORRENT_SITE = 'https://xdcc.horriblesubs.info/?search='
SHOW_TITLE = '[HorribleSubs] One Piece - 913 [1080p]'

LATEST_RELEASES = 'https://horriblesubs.info/api.php?method=getlatest'
MORE_LATEST = '&nextid='        # range from 0-2


class HorribleSubsURL(Enum):
    LATEST = 'https://horriblesubs.info/api.php?method=getlatest'
    LATEST_SHOW_MORE = 'https://horriblesubs.info/api.php?method=getlatest&nextid='
    # gets all episodes
    IRC_SITE = 'https://xdcc.horriblesubs.info/?search=[HorribleSubs] Rikei ga Koi ni Ochita no de Shoumei shitemita [1080p]'


class HorribleSubsParser:
    def __init__(self):
        self.current_page = 0
        self.recent_releases = {}
        self.current_season = {}
        self.all_shows = []
        self.current_show = None
        self.shows_dict = {}
        self.db = {}

    def construct_show_name(self, show_name, episode_number):
        resolutions = {
            '480p': f'[HorribleSubs] {show_name} - {episode_number} [480p]',
            '720p': f'[HorribleSubs] {show_name} - {episode_number} [720p]',
            '1080p': f'[HorribleSubs] {show_name} - {episode_number} [1080p]',
        }
        return resolutions

    def search_torrent_url(self, show_name, episode_number):
        horrible_show_name = self.construct_show_name(
            show_name, episode_number)
        self.current_show = f'https://xdcc.horriblesubs.info/?search={horrible_show_name["1080p"]}'
        # return f'https://xdcc.horriblesubs.info/?search={horrible_show_name["1080p"]}'

    def get_show_info(self, show_path, name):
        url = f'https://horriblesubs.info{show_path}'
        html_doc = requests.get(url)
        soup = BeautifulSoup(html_doc.content, features='lxml')
        description =  soup.find('div', {'class': 'series-desc'})
        img_source = soup.find('div', {'class': 'series-image'})

        # print(f'Parsed {url}')
        self.db[name] = {
            'desc': description.text,
            'img': img_source.select('img')[0]['src']
        }

        return {
            'desc': description.text,
            'img': img_source.select('img')[0]['src']
        }

    def get_episodes(self):
        # use functions from dynamic loading
        pass

    def get_all_shows(self):
        if not len(self.shows_dict) > 0:
            self.__get_shows('https://horriblesubs.info/shows/')

    def get_current_season_releases(self):
        if not len(self.current_season) > 0:
            self.__get_shows(
                'https://horriblesubs.info/current-season/', True)

    # Current season and all shows use the same html format, this method returns info for both
    def __get_shows(self, source, current_season=False):
        html_doc = requests.get(source)
        soup = BeautifulSoup(html_doc.content, features='lxml')
        shows = soup.findAll("div", {"class": "ind-show"})
        found_shows = []
        for show in shows:
            found_shows.append((show.get_text(), show.select('a')[0]['href']))
            if not current_season:
                self.shows_dict[show.get_text()] = show.select('a')[0]['href']
            else:
                self.current_season[show.get_text()] = show.select('a')[0]['href']
        return found_shows

    def get_latest(self):
        yield self.__parse_latest_list('https://horriblesubs.info/api.php?method=getlatest')
        current_page = 0
        # TODO: change magic number into try catch while response is good
        while current_page < 3:
            yield self.__parse_latest_list(f'https://horriblesubs.info/api.php?method=getlatest&nextid={current_page}')
            current_page += 1

    def __parse_latest_list(self, url):
        html_doc = requests.get(url)
        soup = BeautifulSoup(html_doc.content, features='lxml')

        for links in soup.select('ul > li'):
            date = links.select('span')[0].get_text()
            show_name = links.select('a')[0].get_text()
            if date not in self.recent_releases:
                self.recent_releases[date] = []
                self.recent_releases[date].append(show_name[len(date):])
            else:
                self.recent_releases[date].append(show_name[len(date):])

    # Using 5 worker threads for faster scraping
    def __construct_db(self):
        buff = []
        self.get_all_shows()
        buff = [*self.shows_dict.keys()]
        with ThreadPoolExecutor(max_workers=5) as executor:
            while len(buff) > 0:
                item = buff.pop()
                executor.submit(self.get_show_info, self.shows_dict[item], item)
        # Writing results to json file
        with open('series-db.json', 'w') as out_db:
            json.dump(self.db, out_db)

    def __str__(self):
        return self.recent_releases


from concurrent.futures import ThreadPoolExecutor
import threading


def thread_fun(i):
    print(i)
    

if __name__ == '__main__':
    horrible_parser = HorribleSubsParser()
    horrible_parser.get_current_season_releases()
    pprint.pprint(horrible_parser.current_season)
    
    # with open('series-db.json', 'r') as in_file:
    #     db = json.load(in_file)
    #     pprint.pprint(db)
    #     print(len(db))

    # latest_releases_gen = horrible_parser.get_latest()
    # # Getting latest
    # next(latest_releases_gen)
    # pprint.pprint(horrible_parser.recent_releases)

    # user_choice = input('Show more ? y n\n')
    # while user_choice == 'y':
    #     try:
    #         next(latest_releases_gen)
    #         pprint.pprint(horrible_parser.recent_releases)
    #         user_choice = input('Show more ? y n\n')
    #     except:
    #         print('That\'s all')
    #         break

    # horrible_parser.get_current_season_releases()
    # pprint.pprint(horrible_parser.current_season)
   
    # print("ALL SHOWS\n")
    # keys = [*horrible_parser.shows_dict.keys()]
    # info = horrible_parser.get_show_info(horrible_parser.shows_dict[keys[0]])
    # pprint.pprint(info)
    # pprint.pprint(horrible_parser.all_shows)
    # pprint.pprint(horrible_parser.shows_dict)

   






    
