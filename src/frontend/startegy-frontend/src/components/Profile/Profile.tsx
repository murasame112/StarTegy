import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import {User} from '../../models/user_model';
import { useAuth } from '../../context/auth-context';


function Profile() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const [data, setData] = useState<User>();
		const navigate = useNavigate();
		const { user, loading } = useAuth();


			useEffect(() => {
				if (loading) return;
				if (!user) {
					navigate('/login');
					return;
				}
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4200/user/' + user?.id, {
                    credentials: 'include',
                });

                if (res.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!res.ok) {
                    throw new Error('Fetch failed');
                }
								console.log(user);
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [user, loading, navigate]);
		


    const updatePassword = (event: any) => {
        setPassword(event.target.value);
    };
    const updateRepeatedPassword = (event: any) => {
        setRepeatedPassword(event.target.value);
    };
    const updateEmail = (event: any) => {
        setEmail(event.target.value);
    };

    const updateUser = () => {
        console.log('update user');
    };
    return (
        // - zmiana hasla
        // -
        <div className='card' style={{ width: '800px' }}>
            <div className={styles.creationForm}>
                <div>
                    <div className={styles.creationForm}>
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
                        <button className='buttonPrimary' onClick={updateUser}>
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
