import React, { useState, useEffect, useRef } from 'react';
import { Strategy } from '../../models/strategy_model';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// ===== components =====
import StratListItem from '../StratListItem/StratListItem';

// ===== styles =====
import styles from './StratList.module.css';

function StratList() {
		const divRef = useRef<HTMLDivElement>(null);
		const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
		const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [data, setData] = useState<Strategy[]>([]);
		const [filteredData, setFilteredData] = useState<Strategy[]>([]);
		const [filtersVisible, setFiltersVisible] = useState<boolean>(false);


    useEffect(() => {
        fetch('http://localhost:4200/all')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
								setFilteredData(data);
            })
            .catch((error) => console.log(error))
						.then(()=>{
							setDataLoaded(true); 
						})
    }, []);

		useEffect(() => {
			if (dataLoaded && divRef.current) {
				setMinHeight(divRef.current.offsetHeight);
			}
		}, [dataLoaded]);


		const search = (event: any) => {
			const value = event.target.value.toLowerCase();
			const filtered = data.filter((item: Strategy) =>
				item.title.toLowerCase().includes(value)
			);
			setFilteredData(filtered);
		};

		const filtersButton = () => {

		}

    return (
        <>
					<div className='card' ref={divRef} style={{ minHeight }}>
                <div className={styles.upperBar}>
									<input
                        type='text'
                        placeholder='Search'
                        className={styles.textInput}
                        onChange={search}
                  />
									<div className={styles.buttonsDiv}>
										<Link to={'/create'}><button className={styles.addNewButton + ' buttonPrimary'}>Add new strategy</button></Link>
										<button className={filtersVisible ? 'buttonSecondaryActive' : 'buttonSecondary'} onClick={() => { setFiltersVisible(!filtersVisible)}}>Filter</button>
									</div>

									{filtersVisible && <div className={styles.filters}>
										<label htmlFor='protoss_input' className={styles.filterInputHigh}><input id='protoss_input' className={styles.checkbox} type='checkbox'/>Protoss</label>
										<label htmlFor='pvp_input' className={styles.filterInputLow}><input id='pvp_input' className={styles.checkbox} type='checkbox'/>PvP</label>
										<label htmlFor='pvt_input' className={styles.filterInputLow}><input id='pvt_input' className={styles.checkbox} type='checkbox'/>PvT</label>
										<label htmlFor='pvz_input' className={styles.filterInputLow}><input id='pvz_input' className={styles.checkbox} type='checkbox'/>PvZ</label>

										<label htmlFor='terran_input' className={styles.filterInputHigh}><input id='terran_input' className={styles.checkbox} type='checkbox'/>Terran</label>
										<label htmlFor='tvp_input' className={styles.filterInputLow}><input id='tvp_input' className={styles.checkbox} type='checkbox'/>TvP</label>
										<label htmlFor='tvt_input' className={styles.filterInputLow}><input id='TvT_input' className={styles.checkbox} type='checkbox'/>TvT</label>
										<label htmlFor='tvz_input' className={styles.filterInputLow}><input id='TvZ_input' className={styles.checkbox} type='checkbox'/>TvZ</label>

										<label htmlFor='zerg_input' className={styles.filterInputHigh}><input id='zerg_input' className={styles.checkbox} type='checkbox'/>Zerg</label>
										<label htmlFor='zvp_input' className={styles.filterInputLow}><input id='zvp_input' className={styles.checkbox} type='checkbox'/>ZvP</label>
										<label htmlFor='zvt_input' className={styles.filterInputLow}><input id='zvt_input' className={styles.checkbox} type='checkbox'/>ZvT</label>
										<label htmlFor='zvz_input' className={styles.filterInputLow}><input id='zvz_input' className={styles.checkbox} type='checkbox'/>ZvZ</label>
									</div>}

                </div>
                <div className={styles.listBox}>
                    {filteredData.map((item, i) => (
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
