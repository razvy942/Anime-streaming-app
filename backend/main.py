from HorribleSubs import horribleParser
from ApiBindings import kitsu
import json

# https://nyaa.net/apidoc/   Nyaa official api

if __name__ == '__main__':
    # parser = horribleParser.HorribleSubsParser()
    # parser.get_all_shows()
    
    with open('shows-titles.json', 'r') as showsFile:
        myObj = json.load(showsFile)
        
        # crete threads, and then for every title get info from kitsu and create db

    