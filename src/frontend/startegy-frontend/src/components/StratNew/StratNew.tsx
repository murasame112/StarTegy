import { useState } from 'react';
import { Race } from '../../enums/race_enum';
import { Matchup } from '../../enums/matchup_enum';
import { Type } from '../../enums/type_enum';
import { BuildType } from '../../enums/build_type_enum';

import StratNewFormMeta from '../StratNewFormMeta/StratNewFormMeta';
import StratNewFormContent from '../StratNewFormContent/StratNewFormContent';

import stylesDefault from '../../index.css';
import stylesBlank from '../Blank/Blank.module.css';

export type FormData = {
    title: string;
    race: Race;
    matchup: Matchup;
    author: string;
    type: Type;
    buildType: BuildType;
};

const tempFormData = {
	title: "Kret's macro ZvZ",
	race: Race.zerg,
	matchup: Matchup.zvz,
	author: "Kret",
	type: Type.build_notes,
	buildType: BuildType.economic
};

function StratNew() {
    const [formMetaData, setFormMetaData] = useState<FormData>(tempFormData);
    const [formMetaFlag, setFormMetaFlag] = useState<Boolean>(true);
    const [formContentFlag, setFormContentFlag] = useState<Boolean>(false);

    const handleFormMetaData = (data: FormData) => {
        if (data !== undefined) {
            setFormMetaData(data);
            setFormMetaFlag(false);
            setFormContentFlag(true);
        }
    };

    const cl = () => {
        console.log(formMetaData);
    };

    return (
        <>
            <div className={stylesBlank.blank}>
						<div className='card'>
                {formMetaFlag ? (
                    <div>
                        <StratNewFormMeta sendFormData={handleFormMetaData} />
                    </div>
                ) : (
                    <></>
                )}

                {formContentFlag ? (
                    <div>
                        <StratNewFormContent
                            title={formMetaData!.title}
                            race={formMetaData!.race}
                            matchup={formMetaData!.matchup}
                            author={formMetaData!.author}
                            type={formMetaData!.type}
                            buildType={formMetaData!.buildType}
                        />
                    </div>
                ) : (
                    <></>
                )}
								</div>
            </div>

            <button onClick={cl}>console log</button>
        </>
    );
}

export default StratNew;
