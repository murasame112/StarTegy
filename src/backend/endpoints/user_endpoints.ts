import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";;
import * as loginService from "../services/login_service";
import * as mongoClient from '../mongodb/connection';

const table_name = "users";

export function getAllUsers(req: Request, res: Response) {
  const result = mongoClient.getAllItems(table_name);
  result.then((value) => {
    res.status(200).send(value);
  });
}

export function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  const result = mongoClient.getItemById(id, table_name);
  let user: User;
  result.then((value) => {
		if(value == null || value == undefined){
			res.status(400).send("Error");
			return false;
		}
    user = new User(
      value.login,
      value.email,
      value.password,
      value.active,
			value.strategies,
			value.created,
			value._id
    );
    res.status(200).send(user);
  });
}

// example:
//  http://localhost:4200/users/active&true
export function getUsersByQuery(req: Request, res: Response) {
  const field = req.params.field;
  let value: any;
	value = req.params.value;
	
  try {
    value = JSON.parse(value);
  } catch (e: any) {
    value = '"' + value + '"';
    value = JSON.parse(value);
  }

	if(field == 'created'){
		if(typeof value == 'string'){
			value = new Date(value);
		}
	}

  let query = { [field]: value };
  const result = mongoClient.getItemsByField(query, table_name);
  const userArray: User[] = [];
  let user: User;
  result.then((value) => {
    value.forEach((element: User) => {
      user = new User(
        element.login,
        element.email,
        element.password,
        element.active,
				element.strategies,
				element.created,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });

}
// example:
//  http://localhost:4200/usersid/strategies&6490d9efdfd298aad1e8f134
export function getUsersByQueriedId(req: Request, res: Response) {
  const field = req.params.field;
  const value = req.params.value;
  const objValue = new ObjectId(value);

  let query = { [field]: objValue };
  const result = mongoClient.getItemsByField(query, table_name);
  const userArray: User[] = [];
  let user: User;
  result.then((value) => {
    value.forEach((element: User) => {
      user = new User(
        element.login,
        element.email,
        element.password,
        element.active,
				element.strategies,
				element.created,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });
}

export function insertUser(req: Request, res: Response) {
	/*loginService.checkIfUserExists(req.body.email).then((value) => {*/
		// if(value == true){
		// 	res.status(400).send("Error - user already exists");
		// 	return false;
		// }
		const user: User = new User(
			req.body.login,
			req.body.email,
			loginService.hashPassword(req.body.password),
			req.body.password,
			req.body.active,
			req.body.strategies
		);
		const result = mongoClient.insertItem(user, table_name);
		
		result.then((value) => {
			if(value == null || value == undefined){
				res.status(400).send("Error");
				return false;
			}
			if(value.acknowledged){
				res.status(201).send(value.insertedId);
			}else{
				res.status(400).send("Error");
			}
		});
	//});
}

export function deleteUser(req: Request, res: Response) {
  const id = req.params.id;
  const result = mongoClient.deleteItemById(new ObjectId(id), table_name);
  result.then((value) => {
		if(value == null || value == undefined){
			res.status(400).send("Error");
			return false;
		}
		if(value.acknowledged){
			res.status(204).send();
		}else{
			res.status(400).send("Error");
		}
  });
}

export function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  const query = req.body;

	if (typeof query._id !== "undefined") {
    query._id = new ObjectId(query._id);
  }

	let strategy_id: ObjectId;
	if (typeof query.strategies !== "undefined") {
    let strategies_ids: ObjectId[] = [];
    query.strategies.forEach((elem: string) => {
    	strategy_id = new ObjectId(elem);
      strategies_ids.push(strategy_id);
    });
    query.strategies = strategies_ids;
  }

	if(typeof query.password !== "undefined"){
		query.password = loginService.hashPassword(query.password);
		query.password = query.password;
	}
	
	//query.created = global.createDateFromString(query.created); //TODO: co z data?
  const result = mongoClient.updateItemById(id, table_name, query);
  result.then((value) => {
		if(value.acknowledged){
			res.status(204).send();
		}else{
			res.status(400).send("Error");
		}
  });
}
