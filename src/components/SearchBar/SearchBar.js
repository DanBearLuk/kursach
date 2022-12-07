import React, { useState } from 'react';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import Overlay from '../Overlay/Overlay';
import styles from './SearchBar.module.css';

function SearchBar() {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    return (
        <div className={styles.searchBarWrapper}>
            <img src='/search-outline.svg' alt='search icon' />
            <input type='button' onClick={() => setIsOverlayVisible(true)}/>

            {isOverlayVisible && (
                <Overlay onClose={() => setIsOverlayVisible(false)}>
                    <SearchOverlay />
                </Overlay>
            )}
        </div>
    )
}

export default SearchBar;
