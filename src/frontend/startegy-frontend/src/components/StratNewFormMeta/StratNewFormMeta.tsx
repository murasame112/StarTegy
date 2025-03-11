import { useState } from 'react';
import { Race } from '../../enums/race_enum';
import { Matchup } from '../../enums/matchup_enum';
import { Type } from '../../enums/type_enum';
import { FormData } from '../StratNew/StratNew';

import styles from './StratNewFormMeta.module.css';
import { BuildType } from '../../enums/build_type_enum';

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
			console.log(event.target.value);
        setType(event.target.value);
    };

    const updateBuildType = (event: any) => {
        setBuildType(event.target.value);
    };

		const cl = () =>{
			console.log(type);
			console.log(typeof type);
			console.log(typeKeys);
			console.log("----------");


		}

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
            <div>
                <input
                    type='text'
                    placeholder='Title'
                    onChange={updateTitle}
                ></input>
            </div>
            <div className={styles.creationForm}>
                <select value={race} onChange={updateRace}>
                    {raceKeys.map((key: string, index: number) => (
                        <option
                            key={index}
                            value={Race[key as keyof typeof Race]}
                        >
                            {Race[key as keyof typeof Race]}
                        </option>
                    ))}
                </select>

                <select value={matchup} onChange={updateMatchup}>
                    {matchupKeys.map((key: string, index: number) => (
                        <option key={index} value={key}>
                            {Matchup[key as keyof typeof Matchup]}
                        </option>
                    ))}
                </select>

                <div>
                    <input
                        type='text'
                        placeholder='Author'
                        onChange={updateAuthor}
                    ></input>{' '}
                    <p className={styles.info} title='Can leave "unknown"'>
                        &#8520;
                    </p>
                </div>

                <select value={type} onChange={updateType}>
                    {typeKeys.map((key: string, index: number) => (
                        <option key={index} value={key}>
                            {Type[key as keyof typeof Type]}
                        </option>
                    ))}
                </select>

                <select value={buildType} onChange={updateBuildType}>
                    {buildTypeKeys.map((key: string, index: number) => (
                        <option key={index} value={key}>
                            {BuildType[key as keyof typeof BuildType]}
                        </option>
                    ))}
                </select>
                <button onClick={submitForm}>send</button>
								<button onClick={cl}>cl</button>
            </div>
        </>
    );
}

export default StratNewFormMeta;
