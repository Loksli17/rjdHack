import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage                  from "../libs/errorMessage";
import Query                         from "../libs/query";
import crypto                        from 'crypto-js';
import jwt, { JwtPayload }           from 'jsonwebtoken';
import config                        from "../config";
import User                          from "../models/User";
import { getRepository }             from "typeorm";


export default class AudioController{

    private static router: Router = Router();


    public static audiosAllIllegal(req: Request, res: Response){

        interface QueryData{
            skip: string;
            take: string;
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            audios    : Array<Record<string, unknown>> = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        res.status(200).send([
            {id: 1, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
            {id: 2, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
            {id: 3, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
            {id: 4, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
            {id: 5, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
        ]);
    }


    /**
     * Потащить все записи aудио для вывода в таблицу, учитывать skip и take для 
     */
    public static audiosAll(req: Request, res: Response){

        interface QueryData{
            skip: string;
            take: string;
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            audios    : Array<Record<string, unknown>> = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        res.status(200).send([
            {id: 1, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: true, isIllegal: false},
            {id: 2, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: true},
            {id: 3, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: false},
            {id: 4, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: true, isIllegal: true},
            {id: 5, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: false, isIllegal: false},
        ]);
    }

    /**
     * 
     */
    public static audioOne(req: Request, res: Response){

    }

    
    public static routes(): Router{
        this.router.all('/all-illegal', this.audiosAllIllegal);
        
        return this.router;
    }
}

