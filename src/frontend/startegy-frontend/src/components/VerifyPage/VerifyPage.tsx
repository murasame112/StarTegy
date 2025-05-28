import { useState, useEffect } from 'react';
import styles from './VerifyPage.module.css';
import { useNavigate, Link } from 'react-router-dom';

function VerifyPage() {
    const [message, setMessage] = useState('Verifying...');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            fetch(`http://localhost:4200/verify?token=${token}`)
                .then((res) => res.text())
                .then((data) => setMessage(data))
                .catch(() => setMessage('Verification failed.'));
        } else {
            setMessage('Verification email sent.');
        }
    }, []);

    return (
        <div className='card' style={{ width: '800px' }}>
            <p>{message}</p>
            <Link to={'/login'}>
                <button className='buttonSecondary'>Back to login page</button>
            </Link>
        </div>
    );
}

export default VerifyPage;
