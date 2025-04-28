import styles from './Login.module.css';

function Login() {
    return (
        <div className='card' style={{ width: '800px' }}>
            <div className={styles.creationForm}>
                <div>
                    <input
                        type='text'
                        placeholder='login'
                        className={styles.textInput}
                    ></input>
                    <input
                        type='password'
                        placeholder='password'
                        className={styles.textInput}
                    ></input>
                </div>
                <div>
                    <button className='buttonPrimary'>send</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
