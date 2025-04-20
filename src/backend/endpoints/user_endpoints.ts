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
//  http://localhost:3000/users/active&true
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
//  http://localhost:3000/usersid/strategy&6490d9efdfd298aad1e8f134
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