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
				sameSite: 'lax', // lub 'Strict'/'None' zależnie od potrzeb
				secure: false // true na produkcji z HTTPS
			});
			res.json({ message: 'Logged in' });
		}else{
			res.status(400).send("Error");
		}
  });
}

export function logout(req: Request, res: Response) {
	res.clearCookie('token');
  res.json({ message: 'Logged out' });
}