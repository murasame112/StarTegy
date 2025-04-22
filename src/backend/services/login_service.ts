import jwt from 'jsonwebtoken';
import passwordHash from 'password-hash';
import { User } from "../models/user_model";
import fs from 'fs';
import path from 'path';

export async function login(login: string, password: string) {}
// TODO: login service