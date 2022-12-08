import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import TypeContext from '../../contexts/TypeContext';
import UserContext from '../../contexts/UserContext';
import { findTitlesById } from '../../functional/api';
import Outlet from '../Outlet/Outlet';
import SavedTitleInfo from '../SavedTitleInfo/SavedTitleInfo';
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
        if (user.savedList.length === 0) return;

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

    const list = [
        {
            coverSrc: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140439-qpBzXkvVqSx3.jpg',
            title: 'OnePunchMan',
            status: 'in progress',
            description: 'After a disastrous defeat at the 2018 World Cup, Japan\'s team struggles to regroup. But what\'s missing? An absolute Ace Striker, who can guide them to the win. The Japan Football Union is hell-bent on creating a striker who hungers for goals and thirsts for victory, and who can be the decisive instrument in turning around a losing match...and to do so, they\'ve gathered 300 of Japan\'s best and brightest youth players. Who will emerge to lead the team...and will they be able to out-muscle and out-ego everyone who stands in their way?',
            finishedAmount: 355,
            total: 722
        }
    ]

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
                    {list.map(title => (
                        <SavedTitleInfo {...title} />
                    ))}
                </div>
            </div>
        </Outlet>
    );
}

export default UserProfile;
