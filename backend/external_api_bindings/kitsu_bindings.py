import requests
import pprint

class Kitsu:
    def __init__(self):
        self.url = 'https://kitsu.io/api/edge/'
        self.headers = {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        }
        self.mal_id = None 

    # perform this first to get the id, then ask for data
    def search(self, title):
        data = self.__get_id(title)
        return data

    def get_info(self):
        #mal_id = self.__get_id(title)
        # mal_id = 10
        search_uri = self.url + f'anime/{self.mal_id}'
        res = requests.get(search_uri, headers=self.headers)
        return res.json()

    def get_episodes(self, id):
        #mal_id = self.__get_id(title)
        search_uri = self.url + f'anime/{id}/episodes'
        res = requests.get(search_uri, headers=self.headers)
        return res.json()

    def get_characters(self):
        search_uri = self.url + f'castings?filter[media_type]=Anime&filter[media_id]={self.mal_id}&filter[is_character]=true&filter[language]=Japanese&include=character,person&sort=-featured'
        res = requests.get(search_uri, headers=self.headers)
        res = res.json()
        # 2 arrays, data for voice-actors, 'included' from characters
        info = res['included']
        characters_arr = []
        actors_arr = []

        for character in info:
            if character['type'] == 'characters':
                characters_arr.append(character)
            else:
                actors_arr.append(character)

        #return res['included']
        return {'characters': characters_arr, 'actors': actors_arr}

    def __get_id(self, title):
        search_uri = self.url + f'anime?filter[text]={title}'
        res = requests.get(search_uri, headers=self.headers)
        # TODO: handle status 400
        res.raise_for_status()
        res = res.json()
        # data array, usually 1st answer is good but check regardless
        self.mal_id = res['data'][0]['id']
        return  res['data'][0]
        # return res['data'][0]['id']

'castings?filter[media_type]=Anime&filter[media_id]=7442&filter[is_character]=true&filter[language]=Japanese&include=character,person&sort=-featured'

if __name__ == '__main__':
    kitsu = Kitsu()
    print('starting')
    kitsu.search('Attack on titan')
    data = kitsu.get_info()
    #pprint.pprint(data)
    eps = kitsu.get_episodes()
    #pprint.pprint(eps)
    print(kitsu.get_characters())
