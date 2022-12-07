import React from 'react';

const UserContext = React.createContext({
    isAuthorized: false,
    username: '',
    savedList: [],
    update: () => {}
});

export default UserContext;