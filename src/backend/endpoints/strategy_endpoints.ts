import { Console } from 'console';
import { ObjectId } from 'bson';
import express from 'express';
import e, { Request, Response } from 'express';
import { Race } from '../enums/race_enum';
import { Type } from '../enums/type_enum';
import { BuildType } from '../enums/build_type_enum';
import {
    Strategy,
    Content,
    BuildOrder,
    Step,
    Notes,
} from '../models/strategy_model';
import * as mongoClient from '../mongodb/connection';

const collection_name = 'strategies';

export function getAllStrategies(req: Request, res: Response) {
    const result = mongoClient.getAllItems('strategies');
    result.then((value) => {
        res.status(200).send(value);
    });
}
