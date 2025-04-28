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
    res.send(value);
  });
}