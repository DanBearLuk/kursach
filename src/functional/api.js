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
        return (await (await fetch(url, options)).json()).data.Media;
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


async function createAccount(username, password) {
    if (!username || !password) {
        return { success: false };
    }

    const result = await fetch('http://localhost:2700/api/users/createAccount', {
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

    const result = await fetch('http://localhost:2700/api/users/getInfo', {
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
        const result = await fetch('http://localhost:2700/api/users/login', {
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

    const result = await fetch('http://localhost:2700/api/users/login', {
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


export { getTrendingTitles, getTitleInfo, findTitles, getUserInfo, createAccount, logIn };
