import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import TypeContext from '../../contexts/TypeContext';
import UserContext from '../../contexts/UserContext';
import { findTitlesById } from '../../functional/api';
import Outlet from '../Outlet/Outlet';
import TypeSwitch from '../TypeSwitch/TypeSwitch';
import styles from './UserProfile.module.css';

function UserProfile() {
    const user = useContext(UserContext);
    const { type } = useContext(TypeContext);

    const [savedList, setSavedList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    if (user.isChecked && !user.isAuthorized) {
        Navigate({ to: '/' });
    } else if (!user.isChecked) {
        <Outlet centerBlock={<TypeSwitch />}>
            <div>
            </div>
        </Outlet>
    }

    /*
    useEffect(() => {
        if (user.transformedList.length > 0) return;

        const ids = user.savedList.map(t => t.id);
        const titlesInfo = findTitlesById(ids);

        titlesInfo.map(t => {
            const founded = user.savedList.find(s => s.id === t.id);

            return {
                ...t,
                status: founded.status,
                finishedAmount: founded.finishedAmount
            }
        });

        setSavedList(titlesInfo);
    }, []);
    */

    useEffect(() => {
        setFilteredList(savedList.filter(s => s.type.toLowerCase() === type))
    }, [savedList, type]);

    return (
        <Outlet centerBlock={<TypeSwitch />}>
            <div className={styles.wrapper}>
                <div className={styles.leftBlock}>
                    <img alt='person' src='/person.svg' className={styles.personPicture} />
                    <p className={styles.username}>{user.username}</p>

                    <div className={styles.stats}>
                        <span className={styles.stat}>In Progress:</span>
                        <span className={styles.statValue}>{filteredList.filter(t => t.status === 'in progress').length}</span>

                        <span className={styles.stat}>Completed:</span>
                        <span className={styles.statValue}>{filteredList.filter(t => t.status === 'completed').length}</span>
                        
                        <span className={styles.stat}>Planning:</span>
                        <span className={styles.statValue}>{filteredList.filter(t => t.status === 'planning').length}</span>
                    </div>

                    <input className={styles.logOutBtn} type='button' value='Log Out' onClick={() => user.logout()} />
                </div>
                <div className={styles.rightBlock}>

                </div>
            </div>
        </Outlet>
    );
}

export default UserProfile;
