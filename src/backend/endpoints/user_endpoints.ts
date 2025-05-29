import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import e, { Request, Response } from "express";
import { User } from "../models/user_model";;
import * as loginService from "../services/login_service";
import * as mongoClient from '../mongodb/connection';
import { authUser } from '../services/login_service';
import { sendEmail } from '../services/email_service';

const table_name = "users";


const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..','/config.json'), 'utf8'));
const resetPasswordSecret = configJson.resetPasswordSecret;

export async function getAllUsers(req: Request, res: Response) {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
  const result = mongoClient.getAllItems(table_name);
  result.then((value) => {
    res.status(200).send(value);
  });
}

export async function getUserById(req: Request, res: Response) {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
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
			value.pendingPassword,
			value.verified,
			value._id
    );
    res.status(200).send(user);
  });
}

// example:
//  http://localhost:4200/users/active&true
export async function getUsersByQuery(req: Request, res: Response) {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
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
				element.pendingPassword,
				element.verified,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });

}
// example:
//  http://localhost:4200/usersid/strategies&6490d9efdfd298aad1e8f134
export async function getUsersByQueriedId(req: Request, res: Response) {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
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
				element.pendingPassword,
				element.verified,
				element._id
      );
      userArray.push(user);
    });
    res.send(userArray);
  });
}

export async function insertUser(req: Request, res: Response) {
	loginService.checkIfUserExists(req.body.email, req.body.login).then((value) => {
		if(value == true){
			res.status(400).send("Error - user already exists");
			return false;
		}
		const user: User = new User(
			req.body.login,
			req.body.email,
			loginService.hashPassword(req.body.password)
		);
		const result = mongoClient.insertItem(user, table_name);
		
		
		result.then((value) => {
			loginService.sendConfirmationEmail(value!.insertedId, /*TODO: req.body.email*/'tomaszwiesek00@gmail.com');
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
	});
}

export async function deleteUser(req: Request, res: Response) {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
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

export async function updateUser(req: Request, res: Response) {
			if (!(await authUser(req.cookies.token))) {
					res.status(401).json({ message: 'Error - unauthorized' });
					return;
			}
  const id = req.params.id;
  const query = req.body;

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

export async function requestPasswordReset(req: Request, res: Response){
		if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}

	const { email, newPassword } = req.body;
  const result = mongoClient.getItemById(email, table_name);
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
			value.pendingPassword,
			value.verified,
			value._id
    );

		const pendingHash = loginService.hashPassword(newPassword);
		const updateResult = mongoClient.updateItemById(user._id!.toString(), table_name,  { pendingPasswordHash: pendingHash });
		
		updateResult.then((val) => {
			const token = jwt.sign(
				{ userId: user._id },
				resetPasswordSecret,
				{ expiresIn: "15m" }
			);

			  const resetLink = `http://localhost:5173/verify-password-reset?token=${token}`;
				sendEmail(user.email, 'Reset your password', `<p>Click <a href='${resetLink}'>here</a> to confirm your password change.</p>`);
				res.status(204).send("Verification email sent");

		});
  });
}

export async function verifyPasswordReset(req: Request, res: Response): Promise<any> {
	if (!(await authUser(req.cookies.token))) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}

	const token = req.params.token;
	if (!token || typeof token !== "string") {
    return res.status(400).send("Invalid token");
  }

	try {
		const payload = jwt.verify(token, resetPasswordSecret) as {userId: string};
		const user = await mongoClient.getItemById(payload.userId, table_name);

		if(!user || !user.pendingPasswordHash) {
			return res.status(400).send("No password reset pending");
		}

		await mongoClient.updateItemById(payload.userId, table_name, {
			passwordHash: user.pendingPasswordHash,
			pendingPasswordHash: ""
		});

		res.status(204).send("Password reset successful");
	} catch (err) {
		res.status(400).send("Invalid or expired token");
	}
}