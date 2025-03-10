// ===== components =====
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

// ===== styles =====
import styles from './Blank.module.css';

function Blank() {
    return (
        <>
            <Header />
            <div className={styles.blank}></div>
            <Footer />
        </>
    );
}

export default Blank;
