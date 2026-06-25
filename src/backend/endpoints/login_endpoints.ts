import { Console } from "console";
import { ObjectId } from "bson";
import jwt from 'jsonwebtoken';
import express from "express";
import e, { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { User } from "../models/user_model";
import * as mongoClient from '../mongodb/connection';
import * as loginService from "../services/login_service";
import {sendEmail} from "../services/email_service";
import { authUser } from '../services/login_service';
import { verificationSecret, secret } from "../config";

export async function logUserIn(req: Request, res: Response) {
  const result = await loginService.login(req.body.login, req.body.password);

  if (result === false) {
   	res.status(400).send( "Incorrect login or password" );
		 return;
  }
	
	if(typeof result === 'number'){
			switch(result){
				case 403:
					res.status(result).send("Please verify your email before logging in.");
					return;
				default:
					res.status(result).send("Incorrect login or password");
					return;
			}
	}
	
	if(typeof result !== 'number' && typeof result !== 'boolean' && result){
		const user: User = result;
		const mfaCode = loginService.generateMFACode();
		await loginService.saveMFACode(user._id!, mfaCode, user.email);
		res.status(200).json({ requiresMFA: true, userId: user._id });
		return;
	}
	res.status(400).send( "Internal error" );
	return;
		
  	
	// const token = result;
	// 	res.cookie('token', token, {
	// 		httpOnly: true,
	// 		sameSite: 'lax',
	// 		secure: false
	// 	});
	// 	res.json({ message: 'Logged in'});
}


export async function verifyMFA(req: Request, res: Response) {
	const { userId, code } = req.body;
	if (!userId || !code) {
    res.status(400).json({ message: "Missing userId or code" });
		return;
  }

	try {
    const checkMFA = await loginService.compareMFA(userId, code);
		
    if (!checkMFA) {
       res.status(401).json({ message: "Invalid MFA code" });
			 return;
    }
		

		

    const user = await mongoClient.getItemById(userId, 'users');
    const payload = { login: user!.login, id: user!._id };
    const token = jwt.sign(payload, secret);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
		
		loginService.deleteMFA(userId);
    res.status(200).json({ message: "MFA verified" });
		return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
		return;
  }
}

export function logout(req: Request, res: Response) {
	res.clearCookie('token', {
		httpOnly: true,
    sameSite: 'lax',
    secure: false
	});
  res.json({ message: 'Logged out' });
}

export function checkAuth(req: Request, res: Response) {
	const token = req.cookies.token;
  if (!token) {
		res.status(401).send();
		return;
	}

  try {
    loginService.authUser(token);
    res.status(200).send();
  } catch {
    res.status(401).send();
  }
}

export async function me(req: Request, res: Response) {
	let payload = await authUser(req.cookies.token)
	if (!(payload)) {
		res.status(401).json({ message: 'Error - unauthorized' });
		return;
	}
	res.status(200).send(payload);

}

export async function verifyUser(req: Request, res: Response): Promise<any> {
	const { token } = req.query;
	if (typeof token !== 'string') {
    return res.status(400).send('Token is missing or invalid');
  }
  try {
    const payload = jwt.verify(token, verificationSecret) as { userId: string };

	 	await mongoClient.updateItemById(payload.userId, 'users', { verified: true });

    res.status(200).send('Account verified!');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }

}

