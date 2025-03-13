import { useState } from 'react';
import { Race } from '../../enums/race_enum';
import { Matchup } from '../../enums/matchup_enum';
import { Type } from '../../enums/type_enum';
import { FormData } from '../StratNew/StratNew';
import { BuildType } from '../../enums/build_type_enum';

import styles from './StratNewFormMeta.module.css';

function StratNewFormMeta({ sendFormData }: any) {
    const [title, setTitle] = useState<string>('');
    const [race, setRace] = useState<Race>(Race.zerg);
    const [matchup, setMatchup] = useState<Matchup>(Matchup.zvp);
    const [author, setAuthor] = useState<string>('unknown');
    const [type, setType] = useState<Type>(Type.build);
    const [buildType, setBuildType] = useState<BuildType>(BuildType.cheese);

    const getMatchups = (matchup: string) => {
        let reg = new RegExp('z+');
        switch (race) {
            case Race.zerg:
                reg = new RegExp('^z+');
                if (reg.test(matchup)) return true;
                break;
            case Race.protoss:
                reg = new RegExp('^p+');
                if (reg.test(matchup)) return true;
                break;
            case Race.terran:
                reg = new RegExp('^t+');
                if (reg.test(matchup)) return true;
                break;
        }
        return false;
    };

    const raceKeys = Object.keys(Race) as Array<Race>;
    let matchupKeys = Object.keys(Matchup).filter(
        getMatchups
    ) as Array<Matchup>;
    const typeKeys = Object.keys(Type) as Array<Type>;
    const buildTypeKeys = Object.keys(BuildType) as Array<BuildType>;

    const updateTitle = (event: any) => {
        setTitle(event.target.value);
    };

    const updateRace = (event: any) => {
        setRace(event.target.value);
        matchupKeys = Object.keys(Matchup).filter(
            getMatchups
        ) as Array<Matchup>;
    };

    const updateMatchup = (event: any) => {
        setMatchup(event.target.value);
    };

    const updateAuthor = (event: any) => {
        setAuthor(event.target.value);
    };

    const updateType = (event: any) => {
      setType(Type[event.target.value as keyof typeof Type]);
    };

    const updateBuildType = (event: any) => {
        setBuildType(event.target.value);
    };

		const getEnumKey = (value: string) => {
			return Object.keys(Type).find(key => Type[key as keyof typeof Type] === value) || '';
		};

    const submitForm = () => {
        const data: FormData = {
            title: title,
            race: race,
            matchup: matchup,
            author: author,
            type: type,
            buildType: buildType,
        };
        sendFormData(data);
    };

    return (
        <>
            <div className={styles.creationForm}>
                <div>
                    <input
                        type='text'
                        placeholder='Title'
                        className={styles.textInput}
                        onChange={updateTitle}
                    ></input>
                </div>

                <div>
                    <div className={styles.labelDiv}>
                        <label>Race:</label>
                        <select
                            className={styles.selectInput}
                            name='race'
                            value={race}
                            onChange={updateRace}
                        >
                            {raceKeys.map((key: string, index: number) => (
                                <option
                                    key={index}
                                    value={Race[key as keyof typeof Race]}
                                >
                                    {Race[key as keyof typeof Race]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.labelDiv}>
                        <label>Matchup:</label>
                        <select
                            className={styles.selectInput}
                            value={matchup}
                            onChange={updateMatchup}
                        >
                            {matchupKeys.map((key: string, index: number) => (
                                <option key={index} value={key}>
                                    {Matchup[key as keyof typeof Matchup]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
								
                <div>
                    <input
                        type='text'
                        placeholder='Author'
                        className={styles.textInput + ' ' + styles.infoInput}
                        onChange={updateAuthor}
                    ></input>{' '}
                    <p className={styles.info} title='Can leave "unknown"'>
                        &#8520;
                    </p>
                </div>
								
                <div>
                    <div className={styles.labelDiv}>
                        <label>Strategy type:</label>
                        <select
                            className={styles.selectInput}
                            value={getEnumKey(type)}
                            onChange={updateType}
                        >
                            {typeKeys.map((key: string, index: number) => (
                                <option key={index} value={key}>
                                    {Type[key as keyof typeof Type]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.labelDiv}>
                        <label>Build type:</label>
                        <select
                            className={styles.selectInput}
                            value={buildType}
                            onChange={updateBuildType}
                        >
                            {buildTypeKeys.map((key: string, index: number) => (
                                <option key={index} value={key}>
                                    {BuildType[key as keyof typeof BuildType]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <button className='buttonPrimary' onClick={submitForm}>
                        send
                    </button>
                </div>
            </div>
        </>
    );
}

export default StratNewFormMeta;
