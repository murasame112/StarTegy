import { Console } from 'console';
import express from 'express';
import { Request, Response } from 'express';
import * as mongoClient from "./mongodb/connection"
import * as strategyEndpoints from "./endpoints/strategy_endpoints";
import * as userEndpoints from "./endpoints/user_endpoints";
import cors from 'cors';
import fs from 'fs'

const configJson =  JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
export const connectionString = configJson.connectionString;

const app = express();
app.use(express.json());
app.use(cors());
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
app.post("/login", userEndpoints.loginUser);

app.listen(4200);