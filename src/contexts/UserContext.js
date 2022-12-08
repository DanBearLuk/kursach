import React from 'react';

const UserContext = React.createContext({
    isChecked: false,
    isAuthorized: false,
    username: '',
    savedList: [],
    update: () => {},
    logout: () => {},
    login: (username, password) => {},
    signin: (username, password) => {}
});

export default UserContext;