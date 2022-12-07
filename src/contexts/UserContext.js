import React from 'react';

const UserContext = React.createContext({
    isAuthorized: false,
    username: '',
    stats: [],
    saved: []
});

export default UserContext;