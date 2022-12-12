const url = document.location.protocol + '//' + document.location.hostname + ':2700';

async function getTrendingTitles(type, page) {
    let query, variables;
    if (type.toUpperCase() !== 'ALL') {
        query = `
            query ($type: MediaType, $page: Int) {
                Page (page: $page, perPage: 30) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media (type: $type, sort: TRENDING_DESC) {
                        id
                        title {
                            english
                            romaji
                        }
                        coverImage {
                            extraLarge
                        }
                    }
                }
            }
        `;

        variables = {
            type: type.toUpperCase(),
            page
        };
    } else {
        query = `
            query ($page: Int) {
                Page (page: $page, perPage: 30) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media (sort: TRENDING_DESC) {
                        id
                        title {
                            english
                            romaji
                        }
                        coverImage {
                            extraLarge
                        }
                    }
                }
            }
        `;

        variables = {
            page
        };
    }

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    try {
        return (await (await fetch(url, options)).json()).data.Page;
    } catch (e) {
        console.error(e);
        return [];
    }
}


async function getTitleInfo(id) {
    const query = `
    query ($id: Int) {
        Media (id: $id) {
            type
            title {
              english
              romaji
            }
            coverImage {
              extraLarge
            }
            countryOfOrigin
            source
            format
            startDate {
              year
              month
              day
            }
            status
            season
            popularity
            tags {
              name
              rank
            }
            description(asHtml: false)
        }
    }
    `;

    const variables = { id: parseInt(id, 10) };

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    try {
        const media = (await (await fetch(url, options)).json()).data.Media;
        media.description = media.description.replaceAll('<a', '<span');
        media.description = media.description.replaceAll('</a', '</span');

        return media;
    } catch (e) {
        console.error(e);
        return [];
    }
}


async function findTitles(search, page) {
    const query = `
    query ($search: String, $page: Int) {
        Page (page: $page, perPage: 10) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (search: $search, sort: POPULARITY_DESC) {
                id
                title {
                    english
                    romaji
                }
                description
                coverImage {
                    extraLarge
                }
            }
        }
    }
    `;

    const variables = {
        search,
        page
    };

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    try {
        return (await (await fetch(url, options)).json()).data.Page;
    } catch (e) {
        console.error(e);
        return [];
    }
}


async function findTitlesById(ids) {
    const query = `
    query ($ids: [Int], $page: Int) {
        Page (page: $page, perPage: 50) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (id_in: $ids) {
                id
                title {
                    english
                    romaji
                }
                description
                coverImage {
                    extraLarge
                }
                type
                episodes
                chapters
            }
        }
    }
    `;

    let page = 1, result;
    const infos = [];
    do {
        const variables = {
            ids,
            page
        };

        const url = 'https://graphql.anilist.co';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        try {
            result = (await (await fetch(url, options)).json()).data.Page;
            infos.push(...result.media);
        } catch (e) {
            console.error(e);
            return infos;
        }

        page++;
    } while (result.pageInfo.hasNextPage);

    return infos;
}


async function createAccount(username, password) {
    if (!username || !password) {
        return { success: false };
    }

    const result = await fetch(url + '/api/users/createAccount', {
        method: 'POST',
        headers: new Headers ({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ username, password })
    });

    if (result.status !== 429) {
        return await result.json();
    } else {
        return await result;    
    }
}


async function getUserInfo() {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        return { success: false };
    }

    const result = await fetch(url + '/api/users/getInfo', {
        method: 'GET',
        headers: new Headers ({
            'Authorization': 'Bearer ' + token
        }),
    });

    if (result.status !== 429) {
        return await result.json();
    } else {
        return await result;    
    }
}


async function logIn(username, password) {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token && (!username || !password)) {
        return { success: false };
    }

    if (username) {
        const result = await fetch(url + '/api/users/login', {
            method: 'POST',
            headers: new Headers ({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ username, password })
        });

        if (result.status !== 429) {
            return await result.json();
        } else {
            return await result;    
        }
    }

    const result = await fetch(url + '/api/users/login', {
        method: 'POST',
        headers: new Headers ({
            'Authorization': 'Bearer ' + token
        }),
    });

    if (result.status !== 429) {
        return await result.json();
    } else {
        return await result;    
    }
}


async function editList(changes) {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    if (!token && !changes) {
        return { success: false };
    }

    const result = await fetch(url + '/api/editList', {
        method: 'POST',
        headers: new Headers ({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(changes),
        keepalive: true
    });

    if (result.status !== 429) {
        return await result.json();
    } else {
        return await result;   
    }
}


export { 
    getTrendingTitles, 
    getTitleInfo, 
    findTitles, 
    getUserInfo,
    createAccount, 
    logIn, 
    findTitlesById,
    editList
};
