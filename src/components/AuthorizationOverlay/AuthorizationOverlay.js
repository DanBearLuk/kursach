import React, { useState } from 'react';
import styles from './AuthorizationOverlay.module.css';

function AuthorizationOverlay({ type }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = e => {
        e.preventDefault();

        if (!username || !password) return;

        console.log(username, password);
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.authenticationForm} onSubmit={submit}>
                <label>Username</label>
                <input type='text' name='username' onChange={e => setUsername(e.target.value)}/>

                <label>Password</label>
                <input type='password' name='password' onChange={e => setPassword(e.target.value)}/>

                <input type='submit' value={type === 'login' ? 'Log In' : 'Sign In'} />
            </form>
        </div>
    )
}

export default AuthorizationOverlay;
