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
		const [filters, setFilters] = useState<{ [key: string]: boolean }>({
			"Protoss": false,
			"PvP": false,
			"PvT": false,
			"PvZ": false,
			"Terran": false,
			"TvP": false,
			"TvT": false,
			"TvZ": false,
			"Zerg": false,
			"ZvP": false,
			"ZvT": false,
			"ZvZ": false,

		});


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

		const filtersChange = (event: any) => {
			const { name, checked } = event.target;
			console.log(name);

			setFilters((prev) => {
				const updatedFilters: any = {
					...prev,
					[name]: checked,
				};
		
				const selectedFilters = Object.keys(updatedFilters).filter((key) => updatedFilters[key]);
				
				return updatedFilters;
			});
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
                        <Link to={'/create'}>
                            <button
                                className={
                                    styles.addNewButton + ' buttonPrimary'
                                }
                            >
                                Add new strategy
                            </button>
                        </Link>
                        <button
                            className={
                                filtersVisible
                                    ? 'buttonSecondaryActive'
                                    : 'buttonSecondary'
                            }
                            onClick={() => {
                                setFiltersVisible(!filtersVisible);
                            }}
                        >
                            Filter
                        </button>
                    </div>

                    {filtersVisible && (
                        <div className={styles.filters}>
                            {Object.keys(filters).map((key) => (
                                <label
                                    key={key}
                                    htmlFor={key + '_input'}
                                    className={key === 'Protoss' || key === 'Terran' || key === 'Zerg' ? styles.filterInputHigh : styles.filterInputLow}
                                >
                                    <input
                                        name={key}
                                        id={key + '_input'}
																				className={styles.checkbox}
                                        checked={filters[key]}
                                        onChange={filtersChange}
                                        type='checkbox'
                                    />
                                    {key}
                                </label>
                            ))}
                        </div>
                    )}
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
