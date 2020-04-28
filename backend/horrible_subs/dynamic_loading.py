from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.keys import Keys
import time

'''
    Scrapes content from horriblesubs that is loaded dynamically, requires usage of selenium
'''
MAX_WAIT_TIME = 10

options = Options()
options.headless = True
browser = webdriver.Firefox(options=options)


# By default returns latest 12 episodes
def get_latest_episodes(url, episode_provided=False):
    if not episode_provided:
        browser.get(url)
    
    episdes_container = browser.find_element_by_class_name('hs-shows')
    episodes = episdes_container.find_elements_by_class_name('rls-info-container')

    start_time = time.time()
    for episode in episodes:
        while True:
            try:
                episode_links_container = episode.find_element_by_class_name('rls-links-container')
                current_ep = episode_links_container.find_element_by_tag_name('div')
                torrent = (current_ep.find_element_by_class_name('hs-magnet-link')).find_element_by_tag_name('a')
                link = torrent.get_attribute('href')

                print(link)
                # If only searching for 1 episode, break out of loop
                if episode_provided:
                    browser.quit()
                    return
                break
            except (WebDriverException) as ex:
                print(f'Episodes not available {ex}')
                if time.time() - start_time > MAX_WAIT_TIME:
                    browser.quit()
                    raise ex
                time.sleep(0.2)

    browser.quit()

# returns a magnet link for the specified ep number 
def get_episode(url, episode_number='1'):
    browser.get(url)
    input_box = browser.find_element_by_class_name('search-bar')
    input_box.send_keys(episode_number)
    input_box.send_keys(Keys.RETURN)
    time.sleep(0.5)
    get_latest_episodes(True)

if __name__ == '__main__':
    get_latest_episodes('https://horriblesubs.info/shows/shingeki-no-kyojin/')                                                       
    # get_episode()



    