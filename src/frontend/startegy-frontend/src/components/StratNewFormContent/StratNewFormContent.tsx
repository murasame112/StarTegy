import { useState, useEffect } from 'react';

import { FormData } from '../StratNew/StratNew';
import {
    Strategy,
    Notes,
    Content,
    BuildOrder,
    Step,
} from '../../models/strategy_model';
import { parseBuild } from '../../scripts/build_parser';
import { Type } from '../../enums/type_enum';
import { useNavigate } from 'react-router-dom';

import styles from './StratNewFormContent.module.css';

function StratNewFormContent(props: FormData) {
    const navigate = useNavigate();

    const [notes, setNotes] = useState<Notes[]>([
        new Notes(1, 'Note ' + 1, 'This is a note'),
    ]);
    const [parsedBuild, setParsedBuild] = useState<Step[]>([]);

    const parse = (event: any) => {
        const buildString: string = event.target.value;
        const steps: Step[] = parseBuild(buildString);
        setParsedBuild(steps);
    };

    const addNote = () => {
        let note = new Notes(
            notes.length + 1,
            'Note ' + (notes.length + 1),
            'This is a note'
        );
        setNotes(notes.concat([note]));
    };

    const removeLastNote = () => {
        if (notes.length <= 1) {
            alert("Can't delete the last note");
            return false;
        }
        const temp = [...notes];
        temp.splice(notes.length - 1, 1);
        setNotes(temp);
    };

    const removeNote = (index: number) => {
        if (notes.length <= 1) {
            alert("Can't delete the last note");
            return false;
        }
        setNotes(
            notes
                .filter((item) => item.priority !== index)
                .map((item) => {
                    if (item.priority > index) {
                        item.priority = item.priority - 1;
                    }
                    return item;
                })
        );
    };

    const updateTitle = (priority: number, event: any) => {
        setNotes(
            notes.map((item) => {
                if (item.priority === priority) {
                    item.note_title = event.target.value;
                }
                return item;
            })
        );
    };

    const updatePriority = (priority: number, event: any) => {
        const newPriority = parseInt(event.target.value, 10);
        if (newPriority >= notes.length) {
            event.target.value = priority;
        } else {
            const newNotes = notes.map((item) => {
                if (item.priority === newPriority) {
                    item.priority = priority;
                } else if (item.priority === priority) {
                    item.priority = newPriority;
                }
                return item;
            });
            let bufor = newNotes[priority];
            newNotes[priority] = newNotes[newPriority];
            newNotes[newPriority] = bufor;
            setNotes(newNotes);
        }
    };

    const updateContent = (priority: number, event: any) => {
        setNotes(
            notes.map((item) => {
                if (item.priority === priority) {
                    item.note_content = event.target.value;
                }
                return item;
            })
        );
    };

    const sendForm = async () => {
        const buildOrder: BuildOrder = {
            priority: 0,
            steps: parsedBuild,
        };

        const content: Content = {
            ...((props.type === Type.build ||
                props.type === Type.build_notes) && {
                build_order: buildOrder,
            }),
            ...((props.type === Type.notes ||
                props.type === Type.build_notes) && { notes: notes }),
        };

        const strat: Strategy = {
            race: props.race,
            title: props.title,
            matchup: [props.matchup],
            author: props.author,
            uploaded_by: 'current_user', //TODO: tu current usera powinno pobierac
            type: props.type,
            build_type: props.buildType,
            tags: [],
            content: content,
        };

        try {
            const response = await fetch('http://localhost:4200/strategy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(strat),
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
						navigate("/");
        } catch (error) {
            alert('Internal error');
        }
    };

    return (
        <>
            <div className={styles.summary}>
                <p className={styles.summaryTitle}>
                    {props.title} - {props.matchup}
                </p>
                <br />
                <div className={styles.summaryAdditional}>
                    <p>{props.author}</p>
                    <p>{props.buildType}</p>
                </div>
            </div>
            {props.type == Type.notes ? (
                <></>
            ) : (
                <div className={styles.buildOrder}>
                    <textarea
                        placeholder='Paste your build order here!'
                        onChange={parse}
                        spellCheck='false'
                    ></textarea>

                    <div className={styles.buildParsed}>
                        {parsedBuild.length === 0 ? (
                            <p className={styles.buildContentInfo}>
                                You'll see slightly formatted build order here
                            </p>
                        ) : (
                            ''
                        )}
                        <ul className={styles.buildContent}>
                            {parsedBuild.map((step: Step) => {
                                return (
                                    <>
                                        <li key={step.t1 + '_' + step.step}>
                                            <p>
                                                {step.t1}
                                                {step.t2
                                                    ? ' ' + step.t2
                                                    : ''}{' '}
                                                {step.t1 === '' ? ' ' : '-'}{' '}
                                                {step.step}
                                            </p>
                                        </li>
                                    </>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}

            {props.type == Type.build ? (
                <></>
            ) : (
                <div>
                    <div className={styles.section}>
                        {notes.map((note: Notes, index: number) => {
                            return (
                                <div key={index} className={styles.note}>
                                    <input
                                        className={styles.title}
                                        type='text'
                                        onChange={(event) =>
                                            updateTitle(note.priority, event)
                                        }
                                        value={note.note_title}
                                    ></input>

                                    <input
                                        className={styles.priority}
                                        type='number'
                                        onChange={(event) =>
                                            updatePriority(note.priority, event)
                                        }
                                        value={note.priority}
                                    ></input>

                                    <button
                                        className={styles.remove}
                                        onClick={() =>
                                            removeNote(note.priority)
                                        }
                                    >
                                        X
                                    </button>

                                    <textarea
                                        className={styles.content}
                                        onChange={(event) =>
                                            updateContent(note.priority, event)
                                        }
                                        value={note.note_content}
                                    ></textarea>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.section}>
                        <button
                            className='buttonPrimary'
                            onClick={() => addNote()}
                        >
                            Add new note
                        </button>
                        <button
                            className='buttonPrimary'
                            onClick={removeLastNote}
                        >
                            Remove last note
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.section}>
                <button className='buttonPrimary' onClick={sendForm}>
                    send
                </button>
            </div>
        </>
    );
}

export default StratNewFormContent;
