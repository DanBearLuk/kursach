import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Outlet.module.css';

function Outlet({ leftBlock, centerBlock, rightBlock, children }) {
    return (
        <div className={styles.outletWrapper}>
            <header>
                <div>{leftBlock}</div>

                <div><Link to='/'><img src='/logo.svg' alt='public' className={styles.logo} /></Link></div>

                <div>{centerBlock}</div>

                <div>{rightBlock}</div>
            </header>

            <div className={styles.contentBody}>
                {children}
            </div>
        </div>
    );
}

export default Outlet;
