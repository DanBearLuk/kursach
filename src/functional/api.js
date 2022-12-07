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
    fetch('http://localhost:2700/api/users/createAccount')
}


export { getTrendingTitles, getTitleInfo, findTitles };
