import requests
import re
from bs4 import BeautifulSoup


class NyaaSi:
    def __init__(self):
        self.base_url = 'https://nyaa.si/'
        # ignore case
        self.resolutions = ['480p', '720p', '1080p', 'BD', '1280x720', '1920x1080']

    # Usual name [Fansub] Show Title - Ep [Resolution].mkv, file name is optional
    # Sometimes S##E## can appear too
    def parse(self, name):
        square_bracket_regex = re.compile('\[(.*?)\]')
        paren_regex = re.compile('\((.*?)\)')
        
        square_brackets_attrs = re.findall(square_bracket_regex, name) 
        paren_attrs = re.findall(paren_regex, name)

        sub_group = square_brackets_attrs[0]
        res = self.extract_resolution(square_brackets_attrs)
        if len(res) == 0:
            res = self.extract_resolution(paren_attrs)
               
        names = self.extract_name(name, square_bracket_regex, paren_regex)
        shows = self.extract_episode_number(names)

        shows[0] = shows[0].strip()
        if shows[0].endswith('-'):
            shows[0] = shows[0][0:len(shows[0]) - 1].strip()

        # ret_val = [sub_group, shows[0], shows[1], res[0], shows[2]]
        ret_val = [sub_group, shows, res]

        return ret_val
    

    def extract_episode_number(self, title):
        # if show has a season
        season_regex = re.compile('(S\d\d*)|(Season(\s?)*\d\d*)|$')
        season_number = re.findall(season_regex, title)[0]
        season_number = ''.join(a for a in season_number)
        # season_number = ''.join(re.findall(season_regex, title))
        title = re.sub(season_regex, '', title)
        episode_number = ''.join(re.findall(re.compile('(\d\d+)'), title))
        seasoned_number_regex = re.compile('(E\d\d*)')
        title = re.sub(seasoned_number_regex, '', title)
        episode_title = title.replace(episode_number, '')
       
        if len(episode_number) == 0:
            episode_number = 'BATCH'
        return [episode_title ,episode_number, season_number]

    def extract_resolution(self, attrs):
        resolution = [
            res for res in self.resolutions for attr in attrs if res in attr]
        return resolution


    def extract_name(self, title, square_bracket_regex, paren_regex):
        ep_name = re.sub(square_bracket_regex, '', title)
        ep_name = re.sub(paren_regex, '', ep_name)
        extension_regex = re.compile('(\.mkv)|(\.mp[3|4])')
        ep_name = re.sub(extension_regex, '', ep_name)
        return ep_name.strip()

    def remove_noise(self, title):
        # remove stuff like _
        noise_regex = re.compile('[_]')


if __name__ == '__main__':
    nyaa = NyaaSi()
    nyaa.parse('[LostYears] Attack on Titan Season 4 (48) (WEB 1080p Hi10 AAC) [Dual Audio] (Shingeki no Kyojin)')
