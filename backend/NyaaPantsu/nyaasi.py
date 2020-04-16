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
        
        pass