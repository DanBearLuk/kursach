import React, { useEffect, useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import { getUserInfo, createAccount, logIn } from './functional/api';
import Home from './components/Home';
import TitleInformation from './components/TitleInformation/TitleInformation';
import TypeContext from './contexts/TypeContext';
import UserContext from './contexts/UserContext';
import UserProfile from './components/UserProfile/UserProfile';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/info/:id",
            element: <TitleInformation />,
        },
        {
            path: "/user",
            element: <UserProfile />,
        }
    ]);

    const [type, setType] = useState('anime');
    const [user, setUser] = useState({
        isChecked: false,
        isAuthorized: false,
        username: '',
        savedList: [],
        update: async () => {
            const result = await getUserInfo();

            if (result?.success) {
                setUser(usr => ({ 
                    ...usr,
                    isAuthorized: true,
                    username: result.user.username,
                    savedList: result.user.savedList
                }));
            }

            setUser(usr => ({ 
                ...usr,
                isChecked: true
            }));
            return result;
        },
        login: async (username, password) => {
            const result = await logIn(username, password);

            if (result?.success) {
                document.cookie = 'token=' + result.token;

                setUser(usr => ({ 
                    ...usr,
                    isAuthorized: true,
                    username: result.user.username,
                    savedList: result.user.savedList
                }));
            }

            setUser(usr => ({ 
                ...usr,
                isChecked: true
            }));
            return result;
        },
        signin: async (username, password) => {
            const result = await createAccount(username, password);

            if (result?.success) {
                document.cookie = 'token=' + result.token;

                setUser(usr => ({ 
                    ...usr,
                    isAuthorized: true,
                    username: result.user.username,
                    savedList: result.user.savedList
                }));
            }

            setUser(usr => ({ 
                ...usr,
                isChecked: true
            }));
            return result;
        },
        logout: () => {
            document.cookie = '';

            setUser(usr => ({ 
                ...usr,
                isChecked: true,
                isAuthorized: false,
                username: '',
                savedList: []
            }));
        }
    });

    useEffect(() => {
        async function tryLogIn() {
            try {
                await user.login();
            } catch {
            }
        }

        tryLogIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider value={user}>
            <TypeContext.Provider value={{ type, setType }}>
                <RouterProvider router={router} />
            </TypeContext.Provider>
        </UserContext.Provider>
    )
}

export default App;