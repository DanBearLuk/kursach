import React from 'react';

const UserContext = React.createContext({
    isAuthorized: false,
    username: '',
    savedList: [],
    update: () => {},
    login: (username, password) => {},
    signin: (username, password) => {}
});

export default UserContext;