import React, { useState, useEffect, JSX, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildOrder, Notes, Strategy, Step } from '../../models/strategy_model';

import styles from './StratSingle.module.css';

function StratSingle() {
    const navigate = useNavigate();
		const divRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Strategy>();
		const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
		const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const { id } = useParams();

    useEffect(() => {
        fetch('http://localhost:4200/strategy/' + id)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.log(error))
						.then(() => {
							setDataLoaded(true);;
					});
    }, []);

				useEffect(() => {
						if (dataLoaded && divRef.current) {
								setMinHeight(divRef.current.offsetHeight);
						}
				}, [dataLoaded]);

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
                const listedBuildOrder = element.steps.map((item: Step) => (
                    <li key={item.t1 + '_' + item.step}>
                        <pre>
                            {item.t1} {item.t2 ? item.t2 : ''}{' '}
                            {item.t1 === '' ? ' ' : '-'} {item.step}
                        </pre>
                    </li>
                ));
                pageContent = pageContent.concat(listedBuildOrder);

								// ============== NOTE
            } else if (element instanceof Notes) {
                console.log();
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
						<div className='card' ref={divRef} style={{ minHeight }}>
                <div className={styles.summary}>
                <p className={styles.summaryTitle}>
                    {data.title} - {data.matchup}
                </p>
                <br />
                <div className={styles.summaryAdditional}>
                    <p>Author: {data.author}</p>
                    <p>Author: {data.build_type}</p>
                </div>
            </div>
                <h2>
                    title: {data.title} --- {data.matchup.join(', ')}
                </h2>
                <ul>{pageContent}</ul>
            </div>
        );

    } else {
        navigate('/');
    }
}

export default StratSingle;
