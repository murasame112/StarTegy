import styles from './Header.module.css';
import logo from '/pictures/logo/logo-three_s-removebg-preview.png';
import { useAuth } from '../../context/auth-context';
import {useNavigate} from 'react-router-dom';

function Header() {
	const navigate = useNavigate();
	const { isLoggedIn } = useAuth();
	

	const toStratlist = () => {
		navigate("/");
	}

    return (
        <div className={styles.header}>
            <div className={styles.content} onClick={toStratlist}>
                <div className={styles.logo}>
                    <img
                        className={styles.logo_image}
                        src={logo}
                        alt='pic'
                    ></img>
                </div>
                <div className={styles.title}>
                    <h1>Startegy</h1>
                    <h3>Starcraft 2 build order tool</h3>
                </div>
            </div>
						<div>
						{isLoggedIn && (
							<button className='buttonSecondary'>
								User
							</button>
      			)}
						</div>
        </div>
    );
}

export default Header;
