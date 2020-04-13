import unittest
import NyaaPantsu.nyaaApi

class PantsuAPITest(unittest.TestCase):
    def setUp(self):
        self.nyaa = NyaaPantsu()

    def tearDown(self):
        del self.nyaa

    def test_get_search_results(self):
        self.nyaa.search_torrent('Attack on titan')
        show_name = '[HorribleSubs] Shingeki no Kyojin S2 - 37'
        res = next(self.nyaa.search_torrent(show_name))
        