import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage                  from "../libs/errorMessage";
import Query                         from "../libs/query";
import crypto                        from 'crypto-js';
import jwt, { JwtPayload }           from 'jsonwebtoken';
import config                        from "../config";
import { getRepository }             from "typeorm";
import Worker                        from "../models/Worker";


export default class WorkerController{

    
    private static router: Router = Router();


    public static async search(req: Request, res: Response){

         interface QueryData{
            searchData: string;
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            workers    : Array<Worker>           = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['searchData']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        workers = await getRepository(Worker).createQueryBuilder()
            .where('lastName like :name', {name: `%${QueryData.searchData}%`})
            .getMany();

        res.status(200).send({workers: workers});
    }


    public static routes(): Router{
        this.router.all('/search', this.search);
        
        return this.router;
    }
}