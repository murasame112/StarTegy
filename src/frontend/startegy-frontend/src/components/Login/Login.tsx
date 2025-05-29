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
						console.log(response);

						if (!response.ok) {
								const errorText = await response.text(); // możesz też użyć .json(), jeśli zawsze wysyłasz JSON
								
								if (response.status === 400) {
									alert('Incorrect login or password');
								} else if (response.status === 403) {
									alert('Please verify your email before logging in.');
								} else if (response.status === 429) {
									alert('Too many login attempts, please try again later.');
								}else {
									alert(`Unexpected error: ${response.status} - ${errorText}`);
								}
								return;
						}
						setIsLoggedIn(true);   
						const userRes = await fetch("http://localhost:4200/me", {
							credentials: "include",
						});
						const userData = await userRes.json();
    				setUserAuth(userData); 
						navigate("/");
				 }catch (error) {
						alert('Network error or server unreachable');
						console.error(error);
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
