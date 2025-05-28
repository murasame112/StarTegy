import { Console } from "console";
import { ObjectId } from "bson";
import jwt from 'jsonwebtoken';
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";
import * as mongoClient from '../mongodb/connection';
import * as loginService from "../services/login_service";
import { authUser } from '../services/login_service';

export function logUserIn(req: Request, res: Response) {
  const result = loginService.login(req.body.login, req.body.password);
	result.then((value) => {
		if(value){
			const token = value;
			res.cookie('token', token, {
				httpOnly: true,
				sameSite: 'lax',
				secure: false
			});
			res.json({ message: 'Logged in'});
		} else {
  		res.status(400).json({ message: "Incorrect login or password" });
		}
  });
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
    const payload = jwt.verify(token, 'secret_for_verification') as { userId: string };

	 	await mongoClient.updateItemById(payload.userId, 'users', { verified: true });

    res.status(200).send('Account verified!');
  } catch (err) {
    res.status(400).send('Invalid or expired token');
  }

}