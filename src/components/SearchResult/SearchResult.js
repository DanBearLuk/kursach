import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchResult.module.css';

function SearchResult({ id, title, description, coverSrc, isVisible}) {
    const classes = [styles.searchResultWrapper, !isVisible ? styles.hidden : ''];

    return (
        <Link to={'/info/' + id} style={{ textDecoration: 'none' }}>
            <div className={classes.join(' ')}>
                <img src={coverSrc} alt={title + '\'s cover'} />
                
                <div className={styles.infoWrapper}>
                    <h2>{title}</h2>
                    <p dangerouslySetInnerHTML={{__html: description}} />
                </div>
            </div>
        </Link>
    )
}

export default SearchResult;
