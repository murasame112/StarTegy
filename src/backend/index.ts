import { Console } from 'console';
import express from 'express';
import { Request, Response } from 'express';
import * as mongoClient from "./mongodb/connection"
import * as strategyEndpoints from "./endpoints/strategy_endpoints";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
mongoClient.run();



app.get('/all', strategyEndpoints.getAllStrategies);

app.get('/strategy/:id', strategyEndpoints.getStrategyById);

// test endpoint
app.post("/teststrat", strategyEndpoints.postTestStrategy);

app.post("/strategy", strategyEndpoints.insertStrategy);

app.delete("/strategy/:id", strategyEndpoints.deleteStrategy);

app.listen(4200);