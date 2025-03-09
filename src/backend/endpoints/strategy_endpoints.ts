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

export function getStrategyById(req: Request, res: Response) {
	const id = req.params.id;
	const result = mongoClient.getItemById(id, collection_name);

	let strategy: Strategy;

	result.then((value: any) => {
			if (value === null) {
					res.send(null);
					return;
			}
			strategy = new Strategy(
					value.race,
					value.title,
					value.matchup,
					value.author,
					value.uploaded_by,
					value.type,
					value.build_type,
					value.tags,
					value.content,
					value.date,
					value._id
			);
			res.send(strategy);
	});
}