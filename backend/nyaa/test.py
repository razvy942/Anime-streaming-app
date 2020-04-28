import unittest
from nyaa import nyaa_scraper

class PantsuAPITest(unittest.TestCase):
    def setUp(self):
        self.scraper = nyaa_scraper.NyaaScraper()
        
    def test_get_search_results(self):
        expected_res = {
            "episode_number": "01",
            "magnet": "magnet:?xt=urn:btih:009b4cea1a2d24d50405fdafc320e664c09a5486&dn=%5BHorribleSubs%5D%20Koi%20wa%20Ameagari%20no%20You%20ni%20-%2001%20%5B1080p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce",
            "resolution": "1080p",
            "season": "1",
            "seeders": "13",
            "size": "913.3 MiB",
            "title": "[HorribleSubs] Koi wa Ameagari no You ni - 01 [1080p].mkv",
            "uploaded on": "2018-01-11 18:04"
        }

        show_name = 'Koi wa Ameagari no You ni - 01'
        res = self.scraper.search(show_name, '01', False)
        self.assertDictEqual(expected_res, res[0])
        
 

if __name__ == '__main__':
    unittest.main()