import React from 'react';

const UserContext = React.createContext({
    isChecked: false,
    isAuthorized: false,
    username: '',
    savedList: [],
    update: async () => {},
    logout: () => {},
    login: async (username, password) => {},
    signin: async (username, password) => {}
});

export default UserContext;