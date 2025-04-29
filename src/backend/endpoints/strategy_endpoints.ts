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
import {authUser} from '../services/login_service';

const collection_name = 'strategies';
const collection_del = 'strategies_del';

export function getAllStrategies(req: Request, res: Response) {
    const result = mongoClient.getAllItems(collection_name);
    result.then((value) => {
        res.status(200).send(value);
    });
}

export async function getStrategyById(req: Request, res: Response) {
		if(!await authUser(req.cookies.token)){
			res.status(401).json({ message: 'Error - unauthorized' });
			return;
		}

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

export function insertStrategy(req: Request, res: Response) {
    const bd = req.body;

    const strategy: Strategy = new Strategy(
        bd.race,
        bd.title,
        bd.matchup,
        bd.author,
        bd.uploaded_by,
        bd.type,
        bd.build_type,
        bd.tags,
        bd.content
    );

    const result = mongoClient.insertItem(strategy, collection_name);
    result.then((value: any) => {
        if (value.acknowledged) {
            res.status(201).send(value.insertedId);
        } else {
            res.status(400).send('Error');
        }
    });
}

export function deleteStrategy(req: Request, res: Response) {
    const id = new ObjectId(req.params.id);
    const record = mongoClient.getItemById(req.params.id, collection_name);

    record.then((getValue: any) => {
        if (getValue) {

            const inserted = mongoClient.insertItem(getValue, collection_del);

            inserted.then((insertValue: any) => {
                if (insertValue.acknowledged) {
                    const result = mongoClient.deleteItemById(
                        id,
                        collection_name
                    );

                    result.then((value: any) => {
                        if (value.acknowledged) {
                            res.status(204).send(
                                'Deleted count: ' + value.deletedCount
                            );
                        } else {
                            res.status(400).send('Error');
                        }
                    });
                } else {
                    res.status(400).send('Error');
                    return false;
                }
            });
        } else {
            res.status(400).send('Error');
            return false;
        }
    });
}
