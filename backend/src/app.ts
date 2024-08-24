import express, { Application } from 'express';
import userRoutes from "./routes/userRoutes";
import cors from "cors"
import {headerAuthVerify} from "./helper/Auth";
import responseHandler from "./Handler/responseHandler";
import collectionRoutes from "./routes/collectionRoutes";
import pageRoutes from "./routes/pageRoutes";

const app: Application = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/auth",async (req,res,next)=>{
    if(! await headerAuthVerify(req)) return res.json(responseHandler.UNAUTHORISED("Not authorised"));
    next();
})

app.use('/auth/user', userRoutes);
app.use('/auth/collection', collectionRoutes);
app.use('/auth/page', pageRoutes);

export default app;
