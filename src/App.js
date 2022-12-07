import React, { useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Home from './components/Home';
import TitleInformation from './components/TitleInformation/TitleInformation';
import TypeContext from './contexts/TypeContext';
import UserContext from './contexts/UserContext';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/info/:id",
            element: <TitleInformation />,
        }
    ]);

    const [type, setType] = useState('anime');
    const [user, setUser] = useState({
        isAuthorized: false,
        username: '',
        stats: [],
        saved: []
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <TypeContext.Provider value={{ type, setType }}>
                <RouterProvider router={router} />
            </TypeContext.Provider>
        </UserContext.Provider>
    )
}

export default App;