import React, { useContext } from 'react';
import TypeContext from '../../contexts/TypeContext';
import styles from './TypeSwitch.module.css';

function TypeSwitch() {
    const { type, setType } = useContext(TypeContext);

    return (
        <div className={styles.typesWrapper}>
            <input 
                type='button' 
                name='animeTypeChoose' 
                value='Anime' 
                className={styles.typeBtn} 
                disabled={type === 'anime'}
                onClick={() => setType('anime')} 
                />

            <input 
                type='button' 
                name='mangaTypeChoose' 
                value='All' 
                className={styles.typeBtn} 
                disabled={type === 'all'}
                onClick={() => setType('all')}
                />

            <input 
                type='button' 
                name='mangaTypeChoose' 
                value='Manga' 
                className={styles.typeBtn} 
                disabled={type === 'manga'}
                onClick={() => setType('manga')}
                />
        </div>
    )
}

export default TypeSwitch;
