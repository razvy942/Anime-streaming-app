import requests
import pprint
import re

# https://nyaa.net/apidoc/   Nyaa official api

class NyaaPantsu:
    def __init__(self):
        self.base_url = 'https://nyaa.pantsu.cat/api/'

    def search_torrent(self, name, episode_number):
        page = 1
        show = self.__construct_search_string(name, episode_number)
        url = f'{self.base_url}search?q={show}&page='
        res = requests.get(url + str(page))
        res.raise_for_status()  # in case response is 4xx or 5xx
        return res.json()
        # TODO: take a look at this 
        # while len(res.json()['torrents']):
        #     yield res.json()
        #     page += 1 
        #     res = requests.get(url + str(page))
        
    def get_available_resolutions(self, show):
        regex = re.compile('\[(.*?)\]')
        matches = re.findall(regex, show)
        resolutions = []
        for match in matches:
            if re.search(re.compile('.*[\d*][p]$'), match):
                resolutions.append(match)
        return resolutions

    # return a dict that will be sent to frontend with the proper magnet for the episode
    def get_magnet(self, name, episode_number):
        gen = self.search_torrent(name, episode_number)
        search = []
        info_dict = {}
        show_dict = {}
        for show in gen['torrents']:
            # Skip batches
            if 'Batch' in show['name']:
                continue
            # Just get the correct episode, a search for 01 will return everything containing 1
            if episode_number not in show['name']:
                continue
            resolutions = self.get_available_resolutions(show['name'])
            # print(resolutions)
            for resolution in resolutions:
                info_dict[resolution] = show['magnet']
            
        show_dict[name] = info_dict
        search.append(show_dict)
        return search
        

    def get_batch(self, name):
        pass 

    def __get_torrent_info(self, id):
        pass

    def __construct_search_string(self, name, episode_number):
        return f'[HorribleSubs] {name} - {episode_number}'


if __name__ == '__main__':
    nyaa = NyaaPantsu()
   
    shows = nyaa.get_magnet('Majin Bone', '01')
    print(shows)
    