import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage                  from "../libs/errorMessage";
import Query                         from "../libs/query";
import crypto                        from 'crypto-js';
import jwt, { JwtPayload }           from 'jsonwebtoken';
import config                        from "../config";
import { getRepository }             from "typeorm";


export default class WorkerController{

    
    private static router: Router = Router();


    /**
     * api для поиска работников
     */
    public static search(req: Request, res: Response){

        res.status(200).send();
    }


    public static routes(): Router{
        this.router.all('/search', this.search);
        
        return this.router;
    }
}