import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import {User} from '../../models/user_model';
import { useAuth } from '../../context/auth-context';


function Profile() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const [data, setData] = useState<User | undefined>();
		const [updated, setUpdated] = useState<boolean>(false);
		const navigate = useNavigate();
		const { userAuth } = useAuth();


			useEffect(() => {
				if (!userAuth) return;
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:4200/user/' + userAuth?.id, {
                    credentials: 'include',
                });

                if (res.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!res.ok) {
                    throw new Error('Fetch failed');
                }
								
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            } finally{
							setUpdated(false);
						}
        };

        if (userAuth) fetchData();
    }, [userAuth, navigate, updated]);

    const updatePassword = (event: any) => {
        setPassword(event.target.value);
    };
    const updateRepeatedPassword = (event: any) => {
        setRepeatedPassword(event.target.value);
    };
    const updateEmail = (event: any) => {
        setEmail(event.target.value);
    };

    const updateUser = async () => {
								const user: any = {};

								if(password !== ''){
									if(password !== repeatedPassword){
										alert('Passwords are not matching');
										return;
									}else{
										user.password = password;
									}
									
								}
								if(email !== ''){
									user.email = email;
								}
				
								try {
										const response = await fetch('http://localhost:4200/user/' + data?._id , {
												method: 'PATCH',
												credentials: 'include',
												headers: {
														'Content-Type': 'application/json',
												},
												body: JSON.stringify(user),
										});
				
										if (response.status === 401) {
											navigate('/login');
											return;
										}
				
										if (!response.ok) {
												throw new Error(`Response status: ${response.status}`);
										}
								} catch (error) {
										alert('Internal error');
								} finally {
									setUpdated(true);
									setEmail('');
									setPassword('');
									setRepeatedPassword('');
									alert('Updated');
								}
    };

		if(data){
			return (

        <div className='card' style={{ width: '800px' }}>
						<div className={styles.summary}>
							<p className={styles.summaryTitle}>
								<span className={styles.userText}>{data.login}</span>
              </p>
							<p>Email: <span className={styles.userText}>{data.email}</span></p>
							<p>Uploaded strategies: <span className={styles.userText}>15</span></p>
							{/* TODO: ^ powyzej ma nie byc 15 tylko obliczane */}
							<p>Joined:  <span className={styles.userText}>{new Date(data.created).toLocaleDateString("en-GB")}</span></p>
							
							<br />
							
						</div>
						<p className={styles.subtitle}>Edit user:</p>
						<p className={styles.annotation}>Leave blank to keep unchanged</p>
            <div className={styles.creationForm}>
							
                <div>
                    <div className={styles.creationForm}>
                        <input
                            type='email'
                            placeholder='new email'
                            className={styles.textInput}
                            onChange={updateEmail}
														value={email}
                        ></input>
                        <input
                            type='password'
                            placeholder='new password'
                            className={styles.textInput}
                            onChange={updatePassword}
														value={password}
                        ></input>
                        <input
                            type='password'
                            placeholder='repat new password'
                            className={styles.textInput}
                            onChange={updateRepeatedPassword}
														value={repeatedPassword}
                        ></input>
                    </div>
                    <div>
                        <button className='buttonPrimary' onClick={updateUser}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
		}

}

export default Profile;
