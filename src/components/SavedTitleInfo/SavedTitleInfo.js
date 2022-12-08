import React from 'react';
import styles from './SavedTitleInfo.module.css';

function SavedTitleInfo(props) {
    const { 
        title, 
        description, 
        coverSrc, 
        status, 
        finishedAmount, 
        total 
    } = props;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <img className={styles.cover} src={coverSrc} alt='cover' />

                <div className={styles.rightBlock}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>

                    {total && (
                        <div className={styles.finishedWrapper}>
                            <div className={styles.finishedBar}>
                                <div className={styles.inner} style={{ width: finishedAmount / total * 100 + '%'}} />
                            </div>

                            <div>
                                <input className={styles.minusBtn} type='button' value='-' onClick={() => {}} />
                                <input className={styles.plusBtn} type='button' value='+' onClick={() => {}} />
                            </div>

                            <p className={styles.finishedInfo}>{finishedAmount} / {total}</p>
                        </div>
                    )}
                </div>
            </div>


            <input className={styles.deleteBtn} type='button' onClick={() => {}} />
        </div>
    );
}

export default SavedTitleInfo;
