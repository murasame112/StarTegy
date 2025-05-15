import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
		const [login, setLogin] = useState<string>('');
		const [password, setPassword] = useState<string>('');
		const navigate = useNavigate();
		const { setUserAuth, setIsLoggedIn } = useAuth();
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
								credentials: 'include',
								headers: {
										'Content-Type': 'application/json',
								},
								body: JSON.stringify(data),
						});

						if (!response.ok) {
								throw new Error(`Response status: ${response.status}`);
						}
						setIsLoggedIn(true);   
						const userRes = await fetch("http://localhost:4200/me", {
							credentials: "include",
						});
						const userData = await userRes.json();
    				setUserAuth(userData); 
						navigate("/");
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
                <div className={styles.buttons}>
										<div>
                    	<button className='buttonPrimary' onClick={logUserIn}>Login</button>
										</div>
										<Link to={'/registration'}>
                    	<button className='buttonSecondary'>Register</button>
										</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
