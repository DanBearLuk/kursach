import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import AuthorizationOverlay from '../AuthorizationOverlay/AuthorizationOverlay';
import Overlay from '../Overlay/Overlay';
import styles from './AuthorizationPanel.module.css';

function AuthorizationPanel() {
    const { user } = useContext(UserContext);
    const [overlayState, setOverlayState] = useState('hidden');

    if (user.isAuthorized) {
        return (
            <Link to="/user">
                <div className={styles.panel}>
                    <p className={styles.username}>{user.username}</p>
                    <img className={styles.personPicture} alt='person' src='/person.svg' />
                </div>
            </Link>
        );
    } else {
        return (
            <div>
                <input 
                    type='button' 
                    value='Log In' 
                    className={[styles.authorizationBtn, styles.logInBtn].join(' ')} 
                    onClick={() => setOverlayState('login')}
                    />
                <input 
                    type='button' 
                    value='Sign In' 
                    className={[styles.authorizationBtn, styles.signInBtn].join(' ')}
                    onClick={() => setOverlayState('signin')}
                    />

                {overlayState !== 'hidden' && (
                    <Overlay onClose={() => setOverlayState('hidden')}>
                        <AuthorizationOverlay type={overlayState} />
                    </Overlay>
                )}
            </div>
        );
    }
}

export default AuthorizationPanel;