import { useEffect, useRef, useState } from 'react';
import { findTitles, getTrendingTitles } from './api';

function useTrendingTitles(type) {
    const [page, setPage] = useState(1);
    const [lastType, setLastType] = useState(type);
    const [allTitles, setAllTitles] = useState([]);

    useEffect(() => {
        async function appendNew() {
            const pageInfo = await getTrendingTitles(type, page);

            setAllTitles(cur => [...new Set([...cur, ...pageInfo.media])]);
        }

        if (type === lastType) {
            appendNew();
        } else {
            setPage(1);
            setLastType(type);
            setAllTitles([]);
        }
    }, [lastType, type, page]);

    const update = () => setPage(page + 1);

    return [allTitles, update];
}


function useTitlesSearch() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [foundTitles, setFoundTitles] = useState([]);
    const hasNextPageRef = useRef(false);

    useEffect(() => {
        async function appendNew() {
            const pageInfo = await findTitles(search, page);

            hasNextPageRef.current = pageInfo.pageInfo.hasNextPage;
            setFoundTitles(cur => [...new Set([...cur, ...pageInfo.media])]);
        }

        if (search !== '') appendNew();
    }, [search, page]);

    const searchFunction = (search) => {
        setSearch(search);
        setPage(1);
        setFoundTitles([]);
    };

    const update = () => {
        if (hasNextPageRef.current) setPage(page + 1);
    };

    return [foundTitles, searchFunction, update];
}


export { useTrendingTitles, useTitlesSearch };
