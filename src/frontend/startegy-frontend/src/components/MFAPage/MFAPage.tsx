import React, { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
    userId: string;
}

export default function MFAPage() {
    const { setUserAuth, setIsLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state as LocationState;

    const [code, setCode] = useState('');

    const handleVerify = async () => {
        try {
            const response = await fetch('http://localhost:4200/verify-mfa', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, code }),
            });

            if (!response.ok) {
                alert('Invalid MFA code. Please try again.');
                navigate('/login');
                return;
            }
            const data = await response.json();
            alert(data.message);

            setIsLoggedIn(true);
            const userRes = await fetch('http://localhost:4200/me', {
                credentials: 'include',
            });
            const userData = await userRes.json();
            setUserAuth(userData);
            navigate('/');
        } catch (error) {
            console.error('Network error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Multi-Factor Authentication</h2>
            <p>Check your email and enter the code below:</p>
            <input
                type='text'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Enter MFA code'
            />
            <button onClick={handleVerify}>Verify</button>
        </div>
    );
}
