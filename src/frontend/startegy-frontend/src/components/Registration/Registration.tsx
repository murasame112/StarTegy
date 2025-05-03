import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styles from './Registration.module.css';

function Registration() {
    const [login, setLogin] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');

    const navigate = useNavigate();

    const updateLogin = (event: any) => {
        setLogin(event.target.value);
    };
    const updatePassword = (event: any) => {
        setPassword(event.target.value);
    };
    const updateRepeatedPassword = (event: any) => {
        setRepeatedPassword(event.target.value);
    };
    const updateEmail = (event: any) => {
        setEmail(event.target.value);
    };

    const registerUser = async () => {
        const data = {
            login: login,
            email: email,
            password: password,
        };

        if (password === repeatedPassword) {
            try {
                const response = await fetch('http://localhost:4200/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                navigate('/login');
            } catch (error) {
                alert('Could not log in');
            }
        } else {
            alert("Passwords don't match");
        }
    };

    return (
        <div className='card' style={{ width: '800px' }}>
            <div className={styles.creationForm}>
                <div>
                    <input
                        type='text'
                        placeholder='login'
                        className={styles.textInput}
                        onChange={updateLogin}
                    ></input>
                    <input
                        type='email'
                        placeholder='email'
                        className={styles.textInput}
                        onChange={updateEmail}
                    ></input>
                    <input
                        type='password'
                        placeholder='password'
                        className={styles.textInput}
                        onChange={updatePassword}
                    ></input>
                    <input
                        type='password'
                        placeholder='repat password'
                        className={styles.textInput}
                        onChange={updateRepeatedPassword}
                    ></input>
                </div>
                <div>
                    <button className='buttonPrimary' onClick={registerUser}>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Registration;
