import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';
import * as mongoClient from '../mongodb/connection';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import { sendEmail } from './email_service';

const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..','/config.json'), 'utf8'));
const secret = configJson.secret;
const resendApi = configJson.resend;
const verificationSecret = configJson.verificationSecret;
const resend = new Resend(resendApi);
const domainEmail = configJson.domainEmail;

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

export async function login(login: string, password: string): Promise<number | boolean | User> {
	const result = await mongoClient.getItemsByField({"login": login}, 'users');
	const user: User | undefined = result[0];
	if(user == undefined){

		return false;
	}

	if (!verifyPassword(password, user.password)){

		return false;
	}
	
	if (!user.verified) {
  	return 403;
	}

	return user;

}

type MyPayload = {
  login: string;
  id: string;
	iat?: number;
};

export async function authUser(token: string | undefined ){
  if (!token){
		return false;
	} 

  try {
    const payload = jwt.verify(token, secret) as MyPayload;
    return payload;
  } catch (err) {
    return false;
  }
}

export async function sendConfirmationEmail(id: ObjectId, email: string){
	const verificationToken = jwt.sign(
		{ userId: id },
		verificationSecret,
		{ expiresIn: '1h' }
	);

	await sendEmail(email, 'Verify your account', `<p>Click <a href="http://localhost:5173/verify?token=${verificationToken}">here</a> to verify your account.</p>`);
}

export async function saveMFACode(userId: ObjectId, code: number, email: string){
	const now = new Date();
	const expDate = now.setMinutes(now.getMinutes() + 15);
	const result = await mongoClient.insertItem({userId: userId, code: code, expDate: expDate}, 'MFA_codes');

	await sendEmail(email, 'Your verification code', `<p>Your verification code is: ${code}</p>`);
	return result;
}

export function generateMFACode(){
  return Math.floor(100000 + Math.random() * 900000);
}

export async function compareMFA(id: any, code: any){
 	let query = { ['userId']: new ObjectId(id) };

	const result = await mongoClient.getItemsByField(query, 'MFA_codes');

	if (code == result[0].code){
		deleteMFA(id);
		return true;
	}
	return false;
}

export async function deleteMFA(userId: any){
	if(!userId){
		return;
	}
	let query = { ['userId']: new ObjectId(userId) };

	const getResult = await mongoClient.getItemsByField(query, 'MFA_codes');
	if(!getResult[0]){
		return;
	}
	await mongoClient.deleteItemById(new ObjectId(getResult[0]._id), 'MFA_codes');
}