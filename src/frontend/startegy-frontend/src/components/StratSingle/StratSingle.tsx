import React, { useState, useEffect, JSX, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

    let lineBreak = 62;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    'http://localhost:4200/strategy/' + id,
                    {
                        credentials: 'include',
                    }
                );

                if (res.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!res.ok) {
                    throw new Error('Fetch failed');
                }

                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setDataLoaded(true);
            }
        };

        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (dataLoaded && divRef.current) {
            setMinHeight(divRef.current.offsetHeight);
        }
    }, [dataLoaded]);

    function cutLine(str: string) {
        for (let i = lineBreak; i > 0; i--) {
            if (str[i] === ' ' || str[i] === '\t') {
                str = str.substring(0, i) + '\n' + str.substring(i);
                return str;
            }
        }
        str = str.substring(0, lineBreak) + '\n' + str.substring(lineBreak);
        return str;
    }

    function formatStr(str: string) {
        let changed: boolean = false;
        for (let i = lineBreak; i < str.length; i += lineBreak) {
            changed = false;
            for (let j = i; j > 0; j--) {
                if (str[j] === ' ' || str[j] === '\t') {
                    str = str.substring(0, j) + '\n' + str.substring(j);
                    changed = true;
                    break;
                }
            }
            if (!changed) {
                str = str.substring(0, i) + '\n' + str.substring(i);
            }
        }
        return str;
    }

    const toggleDropdown = () => {
        setDropdown(!dropdown);
    };

    const deleteStrategy = () => {
        fetch('http://localhost:4200/strategy/' + id, {
            method: 'DELETE',
        })
            .catch((error) => console.log(error))
            .then(() => {
                navigate('/');
            });
    };

    const saveStrategy = () => {
        console.log('save');
    };

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
                                <p>
                                    {item.t1} {item.t2 ? item.t2 : ''}{' '}
                                    {item.t1 === '' ? ' ' : '-'}{' '}
                                    {item.step.length > 58
                                        ? cutLine(item.step)
                                        : item.step}
                                </p>
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
                        <p>{formatStr(element.note_content)}</p>
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
                            <p>Author: {data.author}</p> |
														<p>Uploaded by: {data.uploaded_by}</p> |
                            <p>Type: {data.build_type}</p>
                        </div>
                    </div>
                    {pageContent}
                </div>
                <div
                    className={
                        styles.dropdownMenu +
                        ' ' +
                        (dropdown
                            ? styles.dropdownMenuOn
                            : styles.dropdownMenuOff)
                    }
                >
                    <Link to={'/edit/' + id}>
                        <button className={styles.dropdownButton}>edit</button>
                    </Link>
                    <button
                        className={styles.dropdownButton}
                        onClick={deleteStrategy}
                    >
                        delete
                    </button>
                    <button
                        className={styles.dropdownButton}
                        onClick={saveStrategy}
                    >
                        save
                    </button>
                </div>
                <button
                    className={
                        styles.dropdownToggle +
                        ' ' +
                        (dropdown
                            ? styles.dropdownToggleOn
                            : styles.dropdownToggleOff)
                    }
                    onClick={toggleDropdown}
                >
                    <img
                        src={arrow}
                        className={dropdown ? styles.dropdownFlipped : ''}
                    ></img>
                </button>
            </div>
        );
    }
}

export default StratSingle;
