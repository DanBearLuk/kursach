import React, { useContext, useState } from 'react';
import styles from './AuthorizationOverlay.module.css';
import UserContext from '../../contexts/UserContext';

function AuthorizationOverlay({ type }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);

    const user = useContext(UserContext);
    console.log(user);

    const submit = async e => {
        e.preventDefault();

        if (!username || !password) return;

        let result;
        if (type === 'login') {
            result = await user.login(username, password);
        } else {
            result = await user.signin(username, password);
        }

        if (!result?.success) {
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.authenticationForm} onSubmit={submit}>
                <label>Username</label>
                <input 
                    type='text' 
                    name='username' 
                    onChange={e => setUsername(e.target.value)}
                    className={isError ? styles.error : ''}
                    />

                <label>Password</label>
                <input 
                    type='password' 
                    name='password' 
                    onChange={e => setPassword(e.target.value)}
                    className={(isError && type === 'signin') ? styles.error : ''}
                    />

                <input type='submit' value={type === 'login' ? 'Log In' : 'Sign In'} />
            </form>
        </div>
    )
}

export default AuthorizationOverlay;
