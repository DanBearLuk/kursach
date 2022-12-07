import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Overlay.module.css';

function Overlay({ children, onClose }) {
    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden';
        return () => document.documentElement.style.overflowY = 'scroll';;
    }, []);

    const closeCheck = (event) => {
        if (event.target === document.getElementById('overlay')) {
            onClose();
        }
    };

    return ReactDOM.createPortal((
            <div className={styles.overlayWrapper} id='overlay' onClick={closeCheck}>
                {children}
            </div>
        ),
        document.getElementById('root')
    );
}

export default Overlay;
