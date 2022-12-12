import React, { useContext, useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router';
import TypeContext from '../../contexts/TypeContext';
import UserContext from '../../contexts/UserContext';
import { editList, findTitlesById } from '../../functional/api';
import Outlet from '../Outlet/Outlet';
import SavedTitleInfo from '../SavedTitleInfo/SavedTitleInfo';
import TypeSwitch from '../TypeSwitch/TypeSwitch';
import styles from './UserProfile.module.css';

function UserProfile() {
    const user = useContext(UserContext);
    const { type } = useContext(TypeContext);

    const [savedList, setSavedList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const changesRef = useRef({
        remove: [],
        edit: []
    });

    if (user.isChecked && !user.isAuthorized) {
        Navigate({ to: '/' });
    } else if (!user.isChecked) {
        <Outlet centerBlock={<TypeSwitch />}>
            <div>
            </div>
        </Outlet>
    }

    useEffect(() => {
        if (user.savedList.length === 0) return;

        async function update() {
            const ids = user.savedList.map(t => t.id);
            const titlesInfo = await findTitlesById(ids);
    
            setSavedList(titlesInfo.map(t => {
                const founded = user.savedList.find(s => s.id === t.id);
    
                return {
                    ...t,
                    status: founded.status,
                    finishedAmount: founded.finishedAmount
                }
            }));
        }

        update();

        const beforeunload = async () => {
            editList(changesRef.current);
        };
        window.addEventListener('beforeunload', beforeunload);

        return async () => {
            await editList(changesRef.current);
            await user.update();

            window.removeEventListener('beforeunload', beforeunload);
        }
    }, [user.savedList]);

    useEffect(() => {
        if (type === 'all') {
            setFilteredList(savedList);
        } else {
            setFilteredList(savedList.filter(s => s.type.toLowerCase() === type));
        }
    }, [savedList, type]);

    const onChange = (info) => {
        const savedListCopy = structuredClone(savedList);
        const changedTitle = savedListCopy.find(t => t.id === info.id);
        
        if (info.status === 'removed') {
            const index = savedListCopy.indexOf(changedTitle);
            savedListCopy.splice(index, 1);

            const changesIndex = changesRef.current.remove.indexOf(info.id);

            if (changesIndex === -1) {
                changesRef.current.remove.push(info.id);
            }
        } else {
            changedTitle.status = info.status;
            changedTitle.finishedAmount = info.finishedAmount;

            const changesIndex = changesRef.current.edit.indexOf(changesRef.current.edit.find(t => t.id === info.id));

            if (changesIndex === -1) {
                changesRef.current.edit.push(info);
            } else {
                changesRef.current.edit[changesIndex] = info;
            }
        }

        setSavedList(savedListCopy);
    };

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
                    {filteredList.map(title => (
                        <SavedTitleInfo key={title.id} {...title} onChange={onChange} />
                    ))}
                </div>
            </div>
        </Outlet>
    );
}

export default UserProfile;
