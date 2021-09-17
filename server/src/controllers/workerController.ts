import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage                  from "../libs/errorMessage";
import Query                         from "../libs/query";
import crypto                        from 'crypto-js';
import jwt, { JwtPayload }           from 'jsonwebtoken';
import config                        from "../config";
import User                          from "../models/User";
import { getRepository }             from "typeorm";


export default class WorkerController{

    private static router: Router = Router();

    public static audiosAllIllegal(req: Request, res: Response){

        res.status(200).send();
    }

    public static audiosAll(req: Request, res: Response){

    }

    public static audioOne(req: Request, res: Response){

    }

    public static routes(): Router{
        this.router.post('/login', this.audiosAllIllegal);
        
        return this.router;
    }
}