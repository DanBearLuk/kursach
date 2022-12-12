import React, { useState } from 'react';
import styles from './SavedTitleInfo.module.css';

function SavedTitleInfo(props) {
    const {
        id,
        title, 
        description, 
        coverSrc, 
        status, 
        finishedAmount, 
        total,
        onChange
    } = props;

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteTitle = () => {
        setIsDeleting(true);

        setTimeout(() => {
            onChange({
                id,
                status: 'removed'
            });
        }, 1250);
    };

    let onEdit;
    if (total) {
        onEdit = (newAmount) => {
            if (newAmount < 0) {
                onChange({
                    id,
                    finishedAmount: 0,
                    status: 'planning'
                });
            } else if (newAmount >= total) {
                onChange({
                    id,
                    finishedAmount: total,
                    status: 'completed'
                });
            } else {
                onChange({
                    id,
                    finishedAmount: newAmount,
                    status: 'in progress'
                });
            }
        }
    } else {
        onEdit = (newStatus) => {
            onChange({
                id,
                finishedAmount: 0,
                status: newStatus
            });
        }
    }

    return (
        <div className={[styles.wrapper, isDeleting ? styles.deleting : ''].join(' ')}>
            <div className={styles.innerWrapper}>
                <div className={styles.content}>
                    <img className={styles.cover} src={coverSrc} alt='cover' />

                    <div className={styles.rightBlock}>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.description}>{description}</p>

                        {total !== 0 && (
                            <div className={styles.finishedWrapper}>
                                <div className={styles.finishedBar}>
                                    <div className={styles.inner} style={{ width: finishedAmount / total * 100 + '%'}} />
                                </div>

                                <div>
                                    <input className={styles.minusBtn} type='button' value='-' onClick={() => onEdit(finishedAmount - 1)} />
                                    <input className={styles.plusBtn} type='button' value='+' onClick={() => onEdit(finishedAmount + 1)} />
                                </div>

                                {status === 'in progress' && (
                                    <p className={styles.finishedInfo}>{finishedAmount} / {total}</p>
                                )}

                                {status !== 'in progress' && (
                                    <p className={styles.finishedInfo}>{status}</p>
                                )}
                            </div>
                        )}

                        {total === 0 && (
                            <div className={styles.statusWrapper}>
                                <input
                                    className={styles.statusBtn}
                                    type='button'
                                    value='In Progress'
                                    onClick={() => onEdit('in progress')}
                                    disabled={status === 'in progress'} />
                                <input
                                    className={styles.statusBtn}
                                    type='button'
                                    value='Completed'
                                    onClick={() => onEdit('completed')}
                                    disabled={status === 'completed'} />
                                <input
                                    className={styles.statusBtn}
                                    type='button'
                                    value='Planning'
                                    onClick={() => onEdit('planning')}
                                    disabled={status === 'planning'} />
                            </div>
                        )}
                    </div>
                </div>

                <input className={styles.deleteBtn} type='button' onClick={deleteTitle} />
            </div>
        </div>
    );
}

export default SavedTitleInfo;
