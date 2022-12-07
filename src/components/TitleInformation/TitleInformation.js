import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { Textfit } from 'react-textfit';
import { getTitleInfo } from '../../functional/api';
import Outlet from '../Outlet/Outlet';
import SearchBar from '../SearchBar/SearchBar';
import styles from './TitleInformation.module.css';


function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
}


function TitleInformation() {
    const { id } = useParams();

    const [titleInfo, setTitleInfo] = useState(null);
    const [isTagBtnVisible, setIsTagBtnVisible] = useState(false);
    const [isTagsExtended, setIsTagsExtended] = useState(false);
    const tagsRef = useRef();

    useEffect(() => {
        async function get() {
            setTitleInfo(await getTitleInfo(id));
        }

        get();
    }, [id]);

    useEffect(() => {
        if (!tagsRef.current) return;

        if (tagsRef.current.scrollHeight > tagsRef.current.offsetHeight) {
            setIsTagBtnVisible(true);
        }
    }, [titleInfo]);

    if (!titleInfo) {
        return (
            <Outlet centerBlock={<SearchBar />}>
                <div className={styles.titleInfoWrapper}>
                    <div className={styles.basicInformation}>
                        <div className={styles.leftBlock}>
                            <img alt='cover' src='/loading.svg' className={styles.cover} style={{ objectFit: 'contain' }} />
                            <input type='button' value='Add to My List' className={styles.addBtn}/>
                        </div>
                        <div className={styles.rightBlock}>
                        </div>
                    </div>
                </div>
            </Outlet>
        );
    }

    const {
        type,
        title,
        coverImage,
        description,
        countryOfOrigin,
        source,
        format,
        startDate,
        status,
        season,
        popularity,
        tags
    } = titleInfo;

    let cof = countryOfOrigin;
    if (cof === 'JP') cof = 'Japan';
    if (cof === 'CN') cof = 'China';
    if (cof === 'KR') cof = 'South Korea';

    const tagsStyle = { 
        maxHeight: isTagsExtended ? tagsRef.current.scrollHeight : 96,
    };

    return (
        <Outlet centerBlock={<SearchBar />}>
            <div className={styles.titleInfoWrapper}>
                <div className={styles.basicInformation}>
                    <div className={styles.leftBlock}>
                        <img alt='cover' src={coverImage.extraLarge} className={styles.cover} />
                        <input type='button' value='Add to My List' className={styles.addBtn} onClick={() => {}}/>
                    </div>
                    <div className={styles.rightBlock}>
                        <Textfit mode='multi' max={70} min={10} className={styles.title}>
                            {title.english ?? title.romaji}
                        </Textfit>

                        <div ref={tagsRef} className={styles.tags} style={tagsStyle}>
                            {tags.map(tag => {
                                const classes = [styles.tag];

                                if (tag.rank >= 80) {
                                    classes.push(styles.important);
                                }

                                return (<p key={tag.name} className={classes.join(' ')}>{tag.name}</p>)
                            })}
                        </div>

                        {isTagBtnVisible && (
                            <input 
                                type='button'
                                value={isTagsExtended ? 'Hide' : 'Show All'}
                                className={styles.showAllBtn}
                                onClick={() => setIsTagsExtended(cur => !cur)}
                                />
                        )}

                        <Textfit max={30} min={10} className={styles.description} hidden={isTagsExtended}>
                            <p dangerouslySetInnerHTML={{__html: description}} style={{ margin: 0 }} />
                        </Textfit>
                    </div>
                </div>

                <div className={styles.additionalInformation}>
                    <div className={styles.wrapper}>
                        <p className={styles.attribute}>Format</p>
                        <p className={styles.value}>{format}</p>
                    </div>
                    <div className={styles.wrapper}>
                        <p className={styles.attribute}>Start Date</p>
                        <p className={styles.value}>{getMonthName(startDate.month)} {startDate.day}, {startDate.year}</p>
                    </div>
                    <div className={styles.wrapper}>
                        <p className={styles.attribute}>Status</p>
                        <p className={styles.value}>{status}</p>
                    </div>
                    {type === 'ANIME' && (
                        <div className={styles.wrapper}>
                            <p className={styles.attribute}>Season</p>
                            <p className={styles.value}>{season} {startDate.year}</p>
                        </div>
                    )}
                    {type === 'MANGA' && (
                        <div className={styles.wrapper}>
                            <p className={styles.attribute}>Country of Origin</p>
                            <p className={styles.value}>{cof}</p>
                        </div>
                    )}
                    <div className={styles.wrapper}>
                        <p className={styles.attribute}>Source</p>
                        <p className={styles.value}>{source}</p>
                    </div>
                    <div className={styles.wrapper}>
                        <p className={styles.attribute}>Popularity</p>
                        <p className={styles.value}>{popularity}</p>
                    </div>
                </div>
            </div>
        </Outlet>
    )
}

export default TitleInformation;
