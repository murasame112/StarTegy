import React, { useState, useEffect, JSX, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildOrder, Notes, Strategy, Step } from '../../models/strategy_model';
import { parseBuild } from '../../scripts/build_parser';

import styles from './StratEdit.module.css';

function StratEdit() {
    const navigate = useNavigate();
    const divRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Strategy>();
    const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const { id } = useParams();
    const [parsedBuild, setParsedBuild] = useState<Step[]>([]);
		const textareaRef = useRef<HTMLTextAreaElement>(null);

				useEffect(() => {
					const fetchData = async () => {
						try {
							const res = await fetch('http://localhost:4200/strategy/' + id, {
								credentials: 'include'
							});
			
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
            if (textareaRef.current) {
                const currentValue = textareaRef.current.value;
                const textareaDefaultChange = {
                    target: { value: currentValue },
                } as React.ChangeEvent<HTMLTextAreaElement>;

                parse(textareaDefaultChange);
            }
        }
    }, [dataLoaded]);

    const parse = (event: any) => {
        const buildString: string = event.target.value;
        const steps: Step[] = parseBuild(buildString);
        setParsedBuild(steps);
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

							const buildString = element.steps.map((item: Step) => (
								item.t1 + (item.t2 ? item.t2 : '') + ' ' + (item.t1 === '' ? ' ' : '-') + ' ' + item.step + '\n'
							));

                const listedBuildOrder = (
                    <>
                        <div className={styles.buildOrder}>
                            <textarea
																ref={textareaRef}
                                placeholder='Paste your build order here!'
                                onChange={parse}
                                spellCheck='false'
																defaultValue={buildString.join("")}
                            >
                                
                            </textarea>

                            <div className={styles.buildParsed}>
                                {parsedBuild.length === 0 ? (
                                    <p className={styles.buildContentInfo}>
                                        You'll see slightly formatted build
                                        order here
                                    </p>
                                ) : (
                                    ''
                                )}
                                <ul className={styles.buildContent}>
                                    {parsedBuild.map((step: Step) => {
                                        return (
                                            <>
                                                <li
                                                    key={
                                                        step.t1 +
                                                        '_' +
                                                        step.step
                                                    }
                                                >
                                                    <p>
                                                        {step.t1}
                                                        {step.t2
                                                            ? ' ' + step.t2
                                                            : ''}{' '}
                                                        {step.t1 === ''
                                                            ? ' '
                                                            : '-'}{' '}
                                                        {step.step}
                                                    </p>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </>
                );
                pageContent = pageContent.concat(listedBuildOrder);

                // ============== NOTE
            } else if (element instanceof Notes) {
                const listedNotes = (
                    <div>
                        <h3>{element.note_title}</h3>
                        <br />
                        <p>{element.note_content}</p>
                    </div>
                );
                pageContent = pageContent.concat(listedNotes);
            }
            pageContent.push(<hr />);
        });

        return (
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
        );
    } else {
        navigate('/');
    }
}

export default StratEdit;
