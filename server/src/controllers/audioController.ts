import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage       from "../libs/errorMessage";
import Query              from "../libs/query";
import { getRepository }  from "typeorm";
import Audio              from "../models/Audio";


import { FileArray, UploadedFile }      from "express-fileupload";
//@ts-ignore
import EasyYandex         from 'easy-yandex-s3';
import axios, { AxiosResponse } from "axios";
import { createReadStream } from "fs";
import moment               from 'moment';


import Violation      from "../models/Violation";
//import { Worker } from "cluster";
import Worker         from "../models/Worker";
import WorkerHasAudio from "../models/workerHasAudio";

import getFileError, {ErrorLexem}   from "../libs/getFileError";
import { error } from "console";

export default class AudioController{

    private static router: Router = Router();


    /**
     * Добавить сюда вывод worker которые привязаны к audio + посчитать количество ошибок из бд
     */
    public static async audiosAllIllegal(req: Request, res: Response){

        interface QueryData{
            skip: number;
            take: number;
        }

        let
            dataErrors     : Array<keyof QueryData>     = [],
            audios         : Array<Audio>               = [],
            audiosNormalize: Array<Record<string, any>> = [],
            QueryData      : QueryData                  = req.body;

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        //! don't forget about join for workes (FILTER)
        audios = await getRepository(Audio).createQueryBuilder('audio')
            .innerJoin('workerHasAudio', 'wha', 'wha.audioId = audio.id')          
            .take(QueryData.take)
            .skip(QueryData.skip)
            .where('isChecked = false && isIllegal = true')
            .orderBy('audio.id', "DESC")
            .getMany();           

         for (let i = 0; i < audios.length; i++){
            
            audiosNormalize.push(audios[i]);

            audiosNormalize[i].workers = await getRepository(Worker).createQueryBuilder('worker') 
                .innerJoin('workerHasAudio', 'wha', 'worker.id = wha.workerId') 
                .innerJoin('audio', 'audio', 'audio.id = wha.audioId')   
                .where('audio.id = :id' , {id: audios[i].id})
                .getMany();
                
            audiosNormalize[i].violationCount = await getRepository(Violation).createQueryBuilder('violation')
                .where('violation.audioId = :id' ,{id: audios[i].id})
                .innerJoin('typeError','typeError','typeError.id = violation.typeError.id')          
                .getCount();
        }

        res.status(200).send({audios: audiosNormalize});
    }


    /**
     * ! Добавить сюда вывод worker которые привязаны к audio
     */
    public static async audiosAllIllegalCount(req: Request, res: Response){

        let 
            workers: Array<Worker> = [],
            countValue: number = 0;

        workers = await getRepository(Worker).createQueryBuilder('worker')
            .innerJoin('workerHasAudio', 'wha', 'worker.id = wha.workerId') 
            .innerJoin('audio', 'audio', 'audio.id = wha.audioId')            
            .getMany();
            
        countValue = await getRepository(Audio).createQueryBuilder()
            .innerJoin('workerHasAudio', 'wha', 'wha.audioId = audio.id') 
            .where('isChecked = false && isIllegal = true')
            .orderBy('id', "DESC")
            .getCount();

        res.status(200).send({countValue: countValue});
    }


    /**
     * ! Добавить сюда вывод worker которые привязаны к audio + посчитать количество ошибок из бд
     */
    public static async audiosAll(req: Request, res: Response){

        interface QueryData{
            skip: number;
            take: number;
        }

        let 
            workers        : Array<Worker>              = [],
            dataErrors     : Array<keyof QueryData>     = [],
            audios         : Array<Audio>               = [],
            audiosNormalize: Array<Record<string, any>> = [],
            QueryData      : QueryData                  = req.body;

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }
    
        audios = await getRepository(Audio).createQueryBuilder('audio')
            .innerJoin('workerHasAudio', 'wha', 'wha.audioId = audio.id') 
            .take(QueryData.take)
            .skip(QueryData.skip)
            .orderBy('audio.id', "DESC")
            .getMany();


        for (let i = 0; i < audios.length; i++){ 
            
            audiosNormalize.push(audios[i]);

            audiosNormalize[i].workers = await getRepository(Worker).createQueryBuilder('worker') 
                .innerJoin('workerHasAudio', 'wha', 'worker.id = wha.workerId') 
                .innerJoin('audio', 'audio', 'audio.id = wha.audioId')                   
                .where('audio.id = :id' , {id: audios[i].id})
                .getMany();
                
            audiosNormalize[i].violationCount = await getRepository(Violation).createQueryBuilder('violation')
                .where('violation.audioId = :id' ,{id: audios[i].id})
                .getCount();
        }

        res.status(200).send({audios: audios});
    }


    /**
     * потащить общее количесвто ВСЕХ аудио
     * ! Илья
     */
    public static async audiosAmountAll(req: Request, res: Response){

        let valueCount: number = 0;

        valueCount = await getRepository(Audio).createQueryBuilder()
            .innerJoin('workerHasAudio', 'wha', 'wha.audioId = audio.id')
            .getCount();

        console.log(valueCount);

        res.status(200).send({countValue: valueCount});
    }


    /**
     * потащить одну запись с аудио + потащить все ошибки к ней (сразу с типом ошибки, для этого использовать innerJoin)
     * ! Добавить сюда вывод worker которые привязаны к audio + посчитать количество ошибок из бд
     */
    public static async audioOne(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            audio     : Audio | undefined,
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['id']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        audio = await getRepository(Audio).findOne(QueryData.id);
        
        if (audio != undefined && audio != null){
            audio.violation = await getRepository(Violation).createQueryBuilder('violation')
            .innerJoin('audio' , 'audio', 'violation.audioId = audio.id')
            .innerJoin('typeError', 'typeError', 'typeError.id = violation.typeErrorId')
            .where('audio.id = :id' , {id: audio.id} )
            .getMany();            

            if (audio.violation != undefined && audio.violation != null)
            for (let i = 0 ; i < audio.violation.length; i++){
                audio.violation[i].worker = await getRepository(Worker).createQueryBuilder()
                    .where('worker.id = :id',{id: audio.violation[i].workerId})
                    .getOne();
            }
        }             

        console.log(audio);

        res.status(200).send({audio: audio});
    }


    /**
     * Api который должен принять айдишники работников и id аудио, удалить старые привязки работников и создать новые привязки работников
     * ! Илья
     */
    public static editWorkers(req: Request, res: Response){
        
        interface QueryData{
            workerIds: string;
            audioId  : number
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            audios    : Array<Record<string, unknown>> = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['workerIds', 'audioId']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        res.status(200).send({id: 1, fileAudio: 'default.wav', text: 'Я сказал, тебе, что ты лучшая', isChecked: true, isIllegal: false});
    }


    /**
     * Api для добавления новых записей аудио в бд
     * ! Андрей
     */
    public static addAudios(req: Request, res: Response){
        
    }

    /**
     * Api для сохранения файла
     * ! Андрей
     */
    public static async addAudioFile(req: Request, res: Response){

        let 
            uploadedFile: FileArray | undefined = req.files,
            token       : string                = "t1.9euelZrKisyWio2Xy52SmcfInM6diu3rnpWal56Qz5KPiZSQnY-Pjp6byM_l8_dFKWt1-e9-QQVt_d3z9wVYaHX5735BBW39.75wgZ35ZvrEQCyRyxy0ZvV7VjrwJFZsRgtED9lNjodeb9mGlnc81thFdamNQBNNTCTXXYCkUfUbXmFLcBtChAw",
            file        : UploadedFile;

        if(uploadedFile == undefined) { res.status(400).send({msg: 'err with files'}); return }

        file = uploadedFile.audio as UploadedFile;
        await file.mv(`public/audios/${file.name}`);

        const headers = {
            "Authorization": `Bearer ${token}`
        };
        const FOLDER_ID = "b1g3r4lgbvftcmlle452";

        const params = {
            lang           : "ru-RU",
            profanityFilter: false,
            format         : "lpcm",
            folderId       : FOLDER_ID,
            sampleRateHertz: 8000
        }

        const data = createReadStream(`public/audios/${file.name}`);

        let result: Record<string, any> = {};

        try {
            result = await axios.post(
                "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize", 
                data,
                {
                    headers, params
                }
            );
        } catch (error) {
            console.error(error);
        }

        const audio: Audio | undefined = await getRepository(Audio).createQueryBuilder().where('fileAudio = :filename', {filename: file.name}).getOne();

        let insert: any;

        if(audio == undefined) {
            insert = await getRepository(Audio).save({
                fileAudio: file.name,
                text     : result.data.result || '',
                date     : moment(new Date()).format('YYYY-MM-DD'),
                isChecked: false,
                isIllegal: true,
            });

            console.log(insert);

            await getRepository(WorkerHasAudio).save([{workerId: 1, audioId: insert.id}, {workerId: 2, audioId: insert.id}])
        } else {
            audio.text = result.data.result;
            await getRepository(Audio).save(audio);
            console.log(audio);
        }
        
        const errors: Array<ErrorLexem> = await getFileError(result.data.result, insert ? insert.id : audio!.id);
        console.log('errors:', errors);

        errors.forEach(async err => {
            
            await getRepository(Violation).save(
                {
                    word    : err.word, 
                    timeCode: err.timeCode, 
                    workerId: 1, 
                    audioId : insert ? insert.id : audio!.id,
                    typeErrorId: err.typeErrorId,
                }
            )
        });

        res.status(200).send({msg: 'Success', id: insert ? insert.id : audio!.id, errors: errors});
    }

    /**
     * Api 
     */
    public static async removeAudio(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            dataErrors: Array<keyof QueryData> = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['id']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        await getRepository(WorkerHasAudio).createQueryBuilder()
            .where('audioId = :id', {id: QueryData.id})
            .delete()
            .execute();
            
        await getRepository(Audio).delete(QueryData.id);

        res.send({msg: `Запись с ${QueryData.id} удалена`});
    }


    public static routes(): Router{
        this.router.all('/all-illegal'    , this.audiosAllIllegal);
        this.router.all('/all'            , this.audiosAll);
        this.router.all('/one'            , this.audioOne);
        this.router.all('/illegal-count'  , this.audiosAllIllegalCount);
        this.router.all('/edit-workers'   , this.audiosAllIllegal);
        this.router.all('/add-audios'     , this.addAudios);
        this.router.all('/add-audio-file' , this.addAudioFile);
        this.router.all('/remove'         , this.removeAudio);
        this.router.all('/count'          , this.audiosAmountAll);
        
        return this.router;
    }
}

