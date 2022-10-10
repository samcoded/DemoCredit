import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import route from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', route);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server running on port ' + port);
    if (process.env.NODE_ENV === 'development') {
        console.log('http://localhost:' + port);
    }
});
