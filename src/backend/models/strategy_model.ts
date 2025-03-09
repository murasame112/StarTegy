import { ObjectId } from 'bson';
import { Race } from '../enums/race_enum';
import { Type } from '../enums/type_enum';
import { BuildType } from '../enums/build_type_enum';

export class Strategy {
    race: Race;
    title: string;
    matchup: string[];
    date?: Date;
    author: string;
    uploaded_by: string;
    type: Type;
    build_type: string;
    tags: string[];
    content: Content;
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
        content: Content,
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
        this.content = content;
        this.date = date ? date : new Date();
        this._id = _id ? _id : null;
    }
}

export class Content {
    build_order?: BuildOrder | null;
    notes?: Notes[] | null;

    constructor(build_order?: BuildOrder | null, notes?: Notes[] | null) {
        this.build_order = build_order ? build_order : null;
        this.notes = notes ? notes : null;
    }
}

export class BuildOrder {
    priority: number;
    steps: Step[];

    constructor(priority: number, steps: Step[]) {
        this.priority = priority;
        this.steps = steps;
    }
}

export class Step {
    t1: string;
    step: string;
    t2?: string | null;

    constructor(t1: string, step: string, t2?: string | null) {
        this.t1 = t1;
        this.step = step;
        this.t2 = t2 ? t2 : null;
    }
}

export class Notes {
    priority: number;
    note_title: string;
    note_content: string;

    constructor(priority: number, note_title: string, note_content: string) {
        this.priority = priority;
        this.note_title = note_title;
        this.note_content = note_content;
    }
}
