import app from './app';
import { Request, Response } from 'express';
import {getIPAddress} from "./helper/utils";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0" ,() => {
    console.log(`Server is running on port http://${getIPAddress()}:${PORT}`);
});

app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found');
});