import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';
import * as mongoClient from '../mongodb/connection';

const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..','/config.json'), 'utf8'));
const secret = configJson.secret;

export async function checkIfUserExists(userEmail: string, userLogin: string){
	const result = await mongoClient.getItemsByField({"email": userEmail, "login": userLogin}, 'users');
	if(result.length > 0){
		return true;
	}
	return false;
}

export function hashPassword(password: string){
	return passwordHash.generate(password, {"algorithm": "sha1", "saltLength":8, "iterations":1});
}

export function verifyPassword(password: string, hash: string){
	return passwordHash.verify(password, hash)
}

export async function login(login: string, password: string) {
	const result = await mongoClient.getItemsByField({"login": login}, 'users');
	const user: User | undefined = result[0];
	if(user == undefined){
		//TODO: blad w logowaniu
		return false;
	}

	if (!verifyPassword(password, user.password)){
		//TODO: blad w logowaniu
		return false;
	}


	const createdPayload = {
		"login": login,
		"id": user._id
	}
	let token = jwt.sign(createdPayload, secret);
	return token;

}

export async function authUser(token: string | undefined ){
  if (!token){
		return false;
	} 

  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    return false;
  }
}