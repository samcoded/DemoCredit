import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import route from './routes';

// Export the app
export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'DemoCredit (go to: /api)',
    });
});
app.use(cors());

//api routes
app.use('/api', route);

//general error routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: 'Not Found',
    });
});
