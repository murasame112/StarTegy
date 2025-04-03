import React, { useState, useEffect, JSX, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildOrder, Notes, Strategy, Step } from '../../models/strategy_model';

import arrow from '/pictures/arrows/06A_a2-removebg-preview.png';

import styles from './StratSingle.module.css';

function StratSingle() {
    const navigate = useNavigate();
    const divRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Strategy>();
    const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const { id } = useParams();
    const [dropdown, setDropdown] = useState<boolean>(false);

    useEffect(() => {
        fetch('http://localhost:4200/strategy/' + id)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.log(error))
            .then(() => {
                setDataLoaded(true);
            });
    }, []);

    useEffect(() => {
        if (dataLoaded && divRef.current) {
            setMinHeight(divRef.current.offsetHeight);
        }
    }, [dataLoaded]);

		const toggleDropdown = () => {
			setDropdown(!dropdown);
		}

    if (data) {
        let priorityList: (BuildOrder | Notes)[] = [];
        if (data.content.notes) {
            data.content.notes.forEach((element) => {
                let note = new Notes(
                    element.priority,
                    element.note_title,
                    element.note_content
                );
                priorityList.push(note);
            });
        }
        if (data.content.build_order) {
            let build = new BuildOrder(
                data.content.build_order.priority,
                data.content.build_order.steps
            );
            priorityList.push(build);
        }
        if (priorityList.length === 0) {
            navigate('/');
        }
        priorityList.sort((a, b) => {
            return a.priority - b.priority;
        });

        let pageContent: JSX.Element[] = [];

        // ============== BUILD ORDER
        priorityList.forEach((element: BuildOrder | Notes) => {
            if (element instanceof BuildOrder) {
                const listedBuildOrder = (
                    <ul className={styles.listedBuildOrder}>
                        {element.steps.map((item: Step) => (
                            <li key={item.t1 + '_' + item.step}>
                                <pre>
                                    {item.t1} {item.t2 ? item.t2 : ''}{' '}
                                    {item.t1 === '' ? ' ' : '-'} {item.step}
                                </pre>
                            </li>
                        ))}
                    </ul>
                );
                pageContent = pageContent.concat(listedBuildOrder);

                // ============== NOTE
            } else if (element instanceof Notes) {
                const listedNotes = (
                    <div>
                        <h3>{element.note_title}</h3>
                        <br />
                        <pre>{element.note_content}</pre>
                    </div>
                );
                pageContent = pageContent.concat(listedNotes);
            }
            pageContent.push(<hr />);
        });

        return (
            <div className={styles.container}>
                <div className='card' ref={divRef} style={{ minHeight }}>
                    <div className={styles.summary}>
                        <p className={styles.summaryTitle}>
                            {data.title} - {data.matchup}
                        </p>
                        <br />
                        <div className={styles.summaryAdditional}>
                            <p>Author: {data.author}</p>
                            <p>Type: {data.build_type}</p>
                        </div>
                    </div>
                    {pageContent}
                </div>
								<div className={styles.dropdownMenu + ' ' + (dropdown ? styles.dropdownMenuOn : styles.dropdownMenuOff)}>yoo</div>
                <button className={styles.dropdownToggle + ' ' + (dropdown ? styles.dropdownToggleOn : styles.dropdownToggleOff)} onClick={toggleDropdown}>
                    <img src={arrow}></img>
                </button>
            </div>
        );
    } else {
        navigate('/');
    }
}

export default StratSingle;
