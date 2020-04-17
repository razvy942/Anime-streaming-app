import requests
import re
from bs4 import BeautifulSoup


class NyaaSi:
    def __init__(self):
        self.base_url = 'https://nyaa.si/'
        # ignore case
        self.resolutions = ['480p', '720p', '1080p', 'BD']

    # Usual name [Fansub] Show Title - Ep [Resolution].mkv, file name is optional
    # Sometimes S##E## can appear too
    def parse(self, name):
        titles = ['[EMBER] Kakushigoto S01E03 [1080p] [HEVC WEBRip]',
                  '[Anime Time] Hachi-nan tte, Sore wa Nai deshou! - 02 [1080p HEVC 10bit x265].mkv',
                  '[HorribleSubs] Fugou Keiji Balance - UNLIMITED - 02 [1080p].mkv',
                  '[bonkai77] Fate Zero (ENHANCED) [BD-1080p] [DUAL-AUDIO] [x265] [HEVC] [AAC] [10bit]',
                  '[bonkai77] Fate Zero (ENHANCED) [BD] [1080p] [DUAL-AUDIO] [x265] [HEVC] [AAC] [10bit]',
                  '[TaigaSubs]_Toradora!_(2008)_-_01v2_-_Tiger_and_Dragon_[1280x720_H.264_FLAC][1234ABCD].mkv'
                  ]
        square_bracket_regex = re.compile('\[(.*?)\]')
        paren_regex = re.compile('\((.*?)\)')

        square_brackets_attrs = [re.findall(
            square_bracket_regex, title) for title in titles]
        paren_attrs = [re.findall(paren_regex, title) for title in titles]

        # sub_group = square_brackets_attrs[0]
        res = [self.extract_resolution(attrs)
               for attrs in square_brackets_attrs]

        eps = [self.extract_name(
            ep, square_bracket_regex, paren_regex) for ep in titles]

        # print(f'{eps[1]} released by {sub_group} quality: {res}')

        res2 = self.extract_resolution(
            ['bonkai77', 'BD-1080p', 'DUAL-AUDIO', 'x265', 'HEVC', 'AAC', '10bit'])

        # print(square_brackets_attrs)
        # print(paren_attrs)
        for i in range(len(eps)):
            print(f'{eps[i]} available in {res[i]}')
        # print(eps)
        # print(res)

    def extract_episode_number(self, title):
        pass

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


if __name__ == '__main__':
    nyaa = NyaaSi()
    nyaa.parse('wtv')
