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
            '[bonkai77] Fate Zero (ENHANCED) [BD-1080p] [DUAL-AUDIO] [x265] [HEVC] [AAC] [10bit]',
            '[Judas] Shingeki no Kyojin (Attack on Titan) (Season 3 Complete) [BD 1080p][HEVC x265 10bit][Multi-Subs]',
            '[Cleo] Attack on Titan Season 3 | Shingeki no Kyojin Season 3 [Dual Audio 10bit 720p][HEVC-x265]',
            '[LostYears] Attack on Titan S03E11 (48) (WEB 1080p Hi10 AAC) [Dual Audio] (Shingeki no Kyojin)',
            '[Golumpa] Attack on Titan S3 - 19 (Shingeki no Kyojin S3) [English Dub] [FuniDub 720p x264 AAC] [MKV] [82FDDA31]'
        ]
        expected_output = ['Kakushigoto - 03 [1080p]',
           'Hachi-nan tte, Sore wa Nai deshou! - 02 [1080p]',
           'Fugou Keiji Balance - UNLIMITED - 02 [1080p]' ,
           'Fate Zero - BATCH [1080p]',
           'Shingeki no Kyojin - BATCH [1080p]', 
           'Attack on Titan Season 3 | Shingeki no Kyojin Season 3 - BATCH [720p]',
           'Attack on Titan - 11 [1080p]',
           'Attack on Titan - 19 [720p]'
        ]

        test_output = []
        for title in test_titles:
            parsed_title = self.nyaaSi.parse(title)

            test_output.append(f'{parsed_title[1]} - {parsed_title[2]} [{parsed_title[3]}] - {parsed_title[4]}')
        
        self.assertCountEqual(expected_output, test_output)

if __name__ == '__main__':
    unittest.main()