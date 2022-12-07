import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TitleBlock.module.css';

function TitleBlock({ id, coverSrc, title }) {
    if (id === undefined) {
        return (
            <div className={styles.titleBlock}>
                <div className={[styles.cover, 'loading'].join(' ')} />
                <p className={styles.title}></p>
            </div>
        );
    }

    return (
        <Link to={'/info/' + id} style={{ textDecoration: 'none' }}>
            <div className={styles.titleBlock}>
                <img className={styles.cover} alt={title + '\'s cover'} src={coverSrc} />
                <p className={styles.title}>{title}</p>
            </div>
        </Link>
    )
}

export default TitleBlock;
