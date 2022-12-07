import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TitleBlock.module.css';

function TitleBlock({ id, coverSrc, title }) {
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
