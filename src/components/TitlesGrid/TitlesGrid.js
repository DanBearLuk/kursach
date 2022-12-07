import React, { useContext, useRef, useEffect } from 'react';
import { useTrendingTitles } from '../../functional/hooks';
import TypeContext from '../../contexts/TypeContext';
import styles from './TitlesGrid.module.css';
import TitleBlock from '../TitleBlock/TitleBlock';

function TitlesGrid() {
    const { type } = useContext(TypeContext);
    const [titles, update] = useTrendingTitles(type);
    const infoRef = useRef({ hasTitles: false, lastUpdate: 0});

    useEffect(() => {
        function onScroll(event) {
            if (event.target === document && infoRef.current.lastUpdate < Date.now() - 300 && infoRef.current.hasTitles) {
                const toBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;

                if (toBottom <= 800) {
                    update();
                    infoRef.current.lastUpdate = Date.now();
                }
            }
        }

        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, [update]);

    useEffect(() => {
        infoRef.current.hasTitles = titles.length > 0
    }, [titles]);

    if (titles.length === 0) {
        return (
            <div className={styles.titlesGrid}>
                {[...Array(15).keys()].map(i => (
                    <TitleBlock key={i} />
                ))}
            </div>
        );
    }

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
