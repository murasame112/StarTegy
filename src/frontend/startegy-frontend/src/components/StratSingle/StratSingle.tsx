import React, { useState, useEffect, JSX } from 'react';
import { useParams } from 'react-router-dom';
import { BuildOrder, Notes, Strategy, Step } from '../../models/strategy_model';

function StratSingle() {
    const [data, setData] = useState<Strategy>();
    const { id } = useParams();

    useEffect(() => {
        fetch('http://localhost:4200/strategy/' + id)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.log(error));
    }, []);

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
            return <div>redirect!!!</div>; // TODO: redirect
        }
        priorityList.sort((a, b) => {
            return a.priority - b.priority;
        });

        let pageContent: JSX.Element[] = [];


        priorityList.forEach((element: BuildOrder | Notes) => {
            if (element instanceof BuildOrder) {
                const listedBuildOrder = element.steps.map(
                    (item: Step) => (
                        <li key={item.t1 + '_' + item.step}>
                            <pre>
                                {item.t1} {item.t2 ? item.t2 : ''}{' '}
                                {item.t1 === '' ? ' ' : '-'} {item.step}
                            </pre>
                        </li>
                    )
                );
                pageContent = pageContent.concat(listedBuildOrder);
            } else if (element instanceof Notes) {
							console.log()
                const listedNotes = 
                    <div>
                        <h3>{element.note_title}</h3>
                        <br />
                        <pre>{element.note_content}</pre>
                    </div>
                ;
                pageContent = pageContent.concat(listedNotes);
            }
						pageContent.push(<hr/>);
        });

        return (
            <div>
                <hr />
                <h2>
                    title: {data.title} --- {data.matchup.join(', ')}
                </h2>
                <ul>{pageContent}</ul>
            </div>
        );
    } else {
        return <div>redirect!!!</div>; // TODO: redirect
    }
}

export default StratSingle;
