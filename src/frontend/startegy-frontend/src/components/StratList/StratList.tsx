import React, { useState, useEffect } from 'react';
import { Strategy } from '../../models/strategy_model';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// ===== components =====
import StratListItem from '../StratListItem/StratListItem';

// ===== styles =====
import styles from './StratList.module.css';

function StratList() {
    const [data, setData] = useState<Strategy[]>([]);

    useEffect(() => {
        fetch('http://localhost:4200/all')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.log(error));
    }, []);

		const search = () => {

		}

    return (
        <>
					<div className='card'>
                <div className={styles.filtering}>
									<input
                        type='text'
                        placeholder='Search'
                        className={styles.textInput}
                        onChange={search}
                  />
									<div className={styles.buttonsDiv}>
										<Link to={'/create'}><button className={styles.addNewButton + ' buttonPrimary'}>Add new strategy</button></Link>
										<button className='buttonSecondary'>Filter</button>
									</div>

                </div>
                <div className={styles.listBox}>
                    {data.map((item, i) => (
                        <Link to={'/strategy/' + item._id} key={i}>
                            <StratListItem
                                race={item.race}
                                title={item.title}
                                matchup={item.matchup}
                                date={item.date}
                                author={item.author}
																uploaded_by={item.uploaded_by}
                                type={item.type}
                                tags={item.tags}
                                build_type={item.build_type}
                            />
                        </Link>
                    ))}
                </div>
						</div>
        </>
    );
}

export default StratList;
