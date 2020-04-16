import unittest
import nyaaApi, nyaasi

class PantsuAPITest(unittest.TestCase):
    def setUp(self):
        #self.nyaaPantsu = nyaaApi.NyaaPantsu()
        self.nyaaSi = nyaasi.NyaaSi()

    # def tearDown(self):
    #     del self.nyaaPantsu

    # def test_get_search_results(self):
    #     self.nyaa.search_torrent('Attack on titan')
    #     show_name = '[HorribleSubs] Shingeki no Kyojin S2 - 37'
    #     res = next(self.nyaa.search_torrent(show_name))
        
    def test_title_parsing(self):
        test_titles = ['[EMBER] Kakushigoto S01E03 [1080p] [HEVC WEBRip]', 
            '[Anime Time] Hachi-nan tte, Sore wa Nai deshou! - 02 [1080p HEVC 10bit x265].mkv',
            '[HorribleSubs] Fugou Keiji Balance - UNLIMITED - 02 [1080p].mkv',
            '[bonkai77] Fate Zero (ENHANCED) [BD-1080p] [DUAL-AUDIO] [x265] [HEVC] [AAC] [10bit]'
        ]
        expected_output = ['Kakushigoto - 03 [1080p]',
           'Hachi-nan tte, Sore wa Nai deshou! - 02 [1080p]',
           'Fugou Keiji Balance - UNLIMITED - 02 [1080p]' ,
           'Fate Zero'
        ]

        test_output = []
        for title in test_titles:
            test_output.append(self.nyaaSi.parse(title))
        
        self.assertCountEqual(expected_output, test_output)
        # perform tests

if __name__ == '__main__':
    unittest.main()