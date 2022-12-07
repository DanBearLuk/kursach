import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import styles from './AuthorizationPanel.module.css';

function AuthorizationPanel() {
    const { user } = useContext(UserContext);

    if (user.isAuthorized) {
        return (
            <div></div>
        );
    } else {
        return (
            <div>
                <input type='button' value='Log In' className={[styles.authorizationBtn, styles.logInBtn].join(' ')} />
                <input type='button' value='Sign In' className={[styles.authorizationBtn, styles.signInBtn].join(' ')}/>
            </div>
        );
    }
}

export default AuthorizationPanel;