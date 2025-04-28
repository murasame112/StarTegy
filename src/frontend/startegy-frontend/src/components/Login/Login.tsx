import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
		const [login, setLogin] = useState<string>('');
		const [password, setPassword] = useState<string>('');
		const navigate = useNavigate();

        const updateLogin = (event: any) => {
            setLogin(event.target.value);
        };
				const updatePassword = (event: any) => {
					setPassword(event.target.value);
			};

			const logUserIn = async () =>{
					const data = {
							login: login,
							password: password
					};

					try {
						const response = await fetch('http://localhost:4200/login', {
								method: 'POST',
								headers: {
										'Content-Type': 'application/json',
								},
								body: JSON.stringify(data),
						});
						const responseData = await response.text();

						if (!response.ok) {
								throw new Error(`Response status: ${response.status}`);
						}
						//navigate("/");
				 } catch (error) {
				 		alert('Could not log in');
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
                        type='password'
                        placeholder='password'
                        className={styles.textInput}
												onChange={updatePassword}
                    ></input>
                </div>
                <div>
                    <button className='buttonPrimary' onClick={logUserIn}>send</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
