import { Strategy } from '../../models/strategy_model';
import { ListedStrategy } from '../../models/listed_strategy_model';

// ===== styles =====
import styles from './StratListItem.module.css';

// ===== pictures =====
import zerg_pic from '/pictures/races/zerg_icon.png';
import terran_pic from '/pictures/races/terran_icon.png';
import protoss_pic from '/pictures/races/protoss_icon.png';
import star from '/pictures/misc/star-48.png';

function getPic(race: string) {
    switch (race) {
        case 'Zerg':
            return zerg_pic;
        case 'Terran':
            return terran_pic;
        case 'Protoss':
            return protoss_pic;
    }
}

function StratListItem(props: ListedStrategy) {
    const matchups = props.matchup.join(', ');

    return (
        <div className={styles.box}>
            <div className={styles.pictureBox}>
                <img
                    src={getPic(props.race)}
                    alt='race_picture'
                    className={styles.picture}
                />
            </div>
            <div className={styles.titleBox}>
                <p className={styles.title}>{props.title}</p>
            </div>
            <div className={styles.typeBox}>
                <p className={styles.smallP}>{props.type}</p>
            </div>
            <div className={styles.dateBox}>
                {
                    <p className={styles.smallP}>
                        added{' '}
                        {new Date(props.date!).toLocaleDateString('en-GB')}
                    </p>
                }
            </div>
            <div className={styles.matchupBox}>
                <p className={styles.smallP}>{matchups}</p>
            </div>
            <div className={styles.buildTypeBox}>
                <p className={styles.smallP}>{props.build_type}</p>
            </div>
            <button className={styles.tagsButton}>Tags</button>
        </div>
    );
}

//StratListItem.propTypes = Strategy.propTypes

export default StratListItem;
