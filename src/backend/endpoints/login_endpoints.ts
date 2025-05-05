import { Console } from "console";
import { ObjectId } from "bson";
import express from "express";
import e, { Request, Response } from "express";
import { User } from "../models/user_model";
import * as mongoClient from '../mongodb/connection';
import * as loginService from "../services/login_service";
import { JwtPayload } from "jsonwebtoken";
import fs from 'fs';
import path from 'path';

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
			res.json({ message: 'Logged in' });
		}else{
			res.status(400).send("Error");
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