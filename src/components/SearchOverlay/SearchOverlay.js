import React, { useEffect, useState } from 'react';
import { useTitlesSearch } from '../../functional/hooks';
import SearchResult from '../SearchResult/SearchResult';
import styles from './SearchOverlay.module.css';

function SearchOverlay() {
    const [foundTitles, search, update] = useTitlesSearch();
    const [searchValue, setSearchValue] = useState('');
    const [scrollTop, setScrollTop] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(0);

    const onKeyDown = e => {
        if (e.key === 'Enter') search(searchValue);
    }

    useEffect(() => {
        function onScroll(event) {
            if (lastUpdate < Date.now() - 100) {
                const toBottom = event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight;

                setScrollTop(event.target.scrollTop);
                setLastUpdate(Date.now);

                if (toBottom <= 400) update();
            }
        }

        document.getElementById('searchResults').addEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let pos = -200;
    return (
        <div className={styles.searchOverlayWrapper}>
            <input 
                type='text'
                name='search input' 
                placeholder='. . .' 
                value={searchValue} 
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={onKeyDown}
                />
            <input type='image' src='/search-outline.svg' alt='search button' onClick={() => search(searchValue)}/>

            <div className={styles.searchResultsWrapper}>
                <div id='searchResults' className={styles.searchResults}>
                    {foundTitles.map(titleInfo => {
                        pos += 240;

                        return (
                            <SearchResult 
                                key={titleInfo.id}
                                id={titleInfo.id}
                                title={titleInfo.title.english ?? titleInfo.title.romaji}
                                description={titleInfo.description}
                                coverSrc={titleInfo.coverImage.extraLarge}
                                isVisible={scrollTop <= pos}
                                />
                        );
                    })}

                    <div className={styles.empty} />
                </div>
            </div>
        </div>
    )
}

export default SearchOverlay;
