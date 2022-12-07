import React, { useContext, useState, useEffect } from 'react';
import { useTrendingTitles } from '../../functional/hooks';
import TypeContext from '../../contexts/TypeContext';
import styles from './TitlesGrid.module.css';
import TitleBlock from '../TitleBlock/TitleBlock';

function TitlesGrid() {
    const { type } = useContext(TypeContext);
    const [titles, update] = useTrendingTitles(type);
    const [lastUpdate, setLastUpdate] = useState(0);

    useEffect(() => {
        function onScroll(event) {
            if (event.target === document && lastUpdate < Date.now() - 300) {
                const toBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;

                if (toBottom <= 800) {
                    update();
                    setLastUpdate(Date.now);
                }
            }
        }

        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className={styles.titlesGrid}>
            {titles.map(title => (
                <TitleBlock 
                    key={title.id}
                    id={title.id} 
                    coverSrc={title.coverImage.extraLarge} 
                    title={title.title.english ?? title.title.romaji} 
                    />
            ))}
        </div>
    );
}

export default TitlesGrid;
