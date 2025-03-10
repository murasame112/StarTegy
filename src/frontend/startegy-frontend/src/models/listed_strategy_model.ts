import { ObjectId } from 'bson';
import { Race } from '../enums/race_enum';
import { Type } from '../enums/type_enum';
import { BuildType } from '../enums/build_type_enum';

export class ListedStrategy {
	race: Race;
	title: string;
	matchup: string[];
	date?: Date;
	author: string;
	uploaded_by: string;
	type: Type;
	build_type: string;
	tags: string[];
	_id?: ObjectId | null;

	constructor(
			race: Race,
			title: string,
			matchup: string[],
			author: string,
			uploaded_by: string,
			type: Type,
			build_type: BuildType,
			tags: string[],
			date?: Date | null,
			_id?: ObjectId | null
	) {
			this.race = race;
			this.title = title;
			this.matchup = matchup;
			this.author = author;
			this.uploaded_by = uploaded_by;
			this.type = type;
			this.build_type = build_type;
			this.tags = tags;
			this.date = date ? date : new Date();
			this._id = _id ? _id : null;
	}
}