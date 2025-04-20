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