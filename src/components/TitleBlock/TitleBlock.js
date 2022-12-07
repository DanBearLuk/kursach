import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TitleBlock.module.css';

function TitleBlock({ id, coverSrc, title }) {
    if (id === undefined) {
        return (
            <div className={styles.titleBlock}>
                <img alt='loading' src='/loading.svg' style={{ objectFit: 'contain' }} />
                <p></p>
            </div>
        );
    }

    return (
        <Link to={'/info/' + id} style={{ textDecoration: 'none' }}>
            <div className={styles.titleBlock}>
                <img alt={title + '\'s cover'} src={coverSrc} />
                <p>{title}</p>
            </div>
        </Link>
    )
}

export default TitleBlock;
