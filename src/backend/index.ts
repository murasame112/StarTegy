import { Console } from 'console';
import express from 'express';
import { Request, Response } from 'express';
import * as mongoClient from "./mongodb/connection"
import * as strategyEndpoints from "./endpoints/strategy_endpoints";
import * as userEndpoints from "./endpoints/user_endpoints";
import * as loginEndpoints from "./endpoints/login_endpoints";
import cors from 'cors';
import fs from 'fs'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Resend } from 'resend';

const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
export const connectionString = configJson.connectionString;
const secret = configJson.secret;
const resendApi = configJson.resend;

const app = express();
const resend = new Resend(resendApi);

// resend.emails.send({
// 	from:'onboarding@resend.dev',
// 	to:'afraid333@protonmail.com',
// 	subject:'Hello',
// 	html:'<p>test2</p>'
// });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
mongoClient.run();

// ============ strategy endpoints ============

app.get('/all', strategyEndpoints.getAllStrategies);
app.get('/strategy/:id', strategyEndpoints.getStrategyById);
app.post("/strategy", strategyEndpoints.insertStrategy);
app.delete("/strategy/:id", strategyEndpoints.deleteStrategy);

// ============ user endopints ============

app.get("/users", userEndpoints.getAllUsers);
app.get("/user/:id", userEndpoints.getUserById);
app.get("/users/:field&:value", userEndpoints.getUsersByQuery);
app.get("/usersid/:field&:value", userEndpoints.getUsersByQueriedId);
app.post("/user", userEndpoints.insertUser);
app.delete("/user/:id", userEndpoints.deleteUser);
app.patch("/user/:id", userEndpoints.updateUser);

// ============ login endopints ============

app.get("/check-auth", loginEndpoints.checkAuth);
app.post("/login", loginEndpoints.logUserIn);
app.post("/logout", loginEndpoints.logout);
app.get("/me", loginEndpoints.me);


app.listen(4200);