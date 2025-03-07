import { Console } from 'console';
import express from 'express';
import { Request, Response } from 'express';


const app = express();
app.use(express.json());

app.get('/test', testAPI);

function testAPI(req: Request, res: Response){
	

	res.send("works");
}

app.listen(4200);