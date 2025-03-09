import { Console } from 'console';
import express from 'express';
import { Request, Response } from 'express';
import * as mongoClient from "./mongodb/connection"


const app = express();
app.use(express.json());
mongoClient.run();

app.get('/test', testAPI);

function testAPI(req: Request, res: Response){
	const result = mongoClient.getAllItems('strategies');
	result.then((value) => {
			res.status(200).send(value);
	});
}

app.listen(4200);