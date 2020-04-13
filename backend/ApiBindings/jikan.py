import requests
import pprint


class Jikan:
    def __init__(self):
        self.url = 'http://localhost:9000/public/v3/'

    def search(self, name):
        info = self.__get_info(name)
        return info

    def get_episodes(self, id):
        uri = self.url + f'anime/{id}/episodes'
        res = requests.get(uri)
        res.raise_for_status()
        # remember max 100 episodes per page, append /page-number at the end to get rest
        res = res.json()
        episodes_last_page = res['episodes_last_page']
        episodes = res['episodes']
        return episodes


    def get_staff_info(self, id):
        uri = self.url + f'anime/{id}/characters_staff'
        res = requests.get(uri)
        res.raise_for_status()
        return res.json()['characters']

    def get_scores(self, id):
        uri = self.url + f'anime/{id}/stats'
        res = requests.get(uri)
        res.raise_for_status()
        #  {"1": {"votes": int, "percentage": int}, "2"... }
        return res.json()['scores']

    def __get_id(self, name, limit=5):
        # by default limit answers to only 10
        uri = self.url + f'search/anime?q={name}&limit={limit}'
        res = requests.get(uri)
        res.raise_for_status()
        # usually the first result is correct, but if not check the rest
        series = res.json()
        return series['results'][0]['mal_id']

    def __get_info(self, name):
        mal_id = self.__get_id(name)
        info_url = self.url + f'anime/{mal_id}'
        episodes_url = info_url + f'/episodes'

        series_info = requests.get(info_url)
        series_info.raise_for_status()
        info = series_info.json()

        staff_info = self.get_staff_info(mal_id)
        info.update({'characters': staff_info})

        scores_info = self.get_scores(mal_id)
        info.update({'scores': scores_info})
        # episodes_info = requests.get(episodes_url).json()['episodes']
        # episodes_info = {'episodes_info': episodes_info}
        # if not series_info or not episodes_info:
        #     raise Exception('Failed to fetch series info')
        # series_info.update(episodes_info)
        return info


if __name__ == '__main__':
    parser = Jikan()
    results = parser.search('Naruto')
    pprint.pprint(results)