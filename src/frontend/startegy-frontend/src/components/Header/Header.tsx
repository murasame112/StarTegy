import styles from './Header.module.css';
import logo from '/pictures/logo/logo-three_s-removebg-preview.png';

function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.content}>
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
        </div>
    );
}

export default Header;
