import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';
import * as mongoClient from '../mongodb/connection';

export async function checkIfUserExists(userEmail: string, userLogin: string){
	const result = await mongoClient.getItemsByField({"email": userEmail, "login": userLogin}, 'users');
	if(result.length > 0){
		return true;
	}
	return false;
}

export async function login(login: string, password: string) {}
// TODO: login service