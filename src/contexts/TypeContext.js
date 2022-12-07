import React from 'react';

const TypeContext = React.createContext({
    type: 'anime',
    setType: () => {}
});

export default TypeContext;