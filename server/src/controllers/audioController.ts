import { Router, Request, Response, NextFunction } from "express";

import ErrorMessage       from "../libs/errorMessage";
import Query              from "../libs/query";
import { getRepository }  from "typeorm";
import Audio              from "../models/Audio";
import { FileArray }      from "express-fileupload";
import Violation from "../models/Violation";
//import { Worker } from "cluster";
import Worker from "../models/Worker";

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
            dataErrors: Array<keyof QueryData> = [],
            audios    : Array<Audio>           = [],
            QueryData : QueryData              = req.body;

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
            audios[i].workers = await getRepository(Worker).createQueryBuilder('worker') 
                .innerJoin('workerHasAudio', 'wha', 'worker.id = wha.workerId') 
                .innerJoin('audio', 'audio', 'audio.id = wha.audioId')                   
                .where('audio.id = :id' , {id: audios[i].id})
                .getMany();
                
            audios[i].violationCount = await getRepository(Violation).createQueryBuilder('violation')
                .where('violation.audioId = :id' ,{id: audios[i].id})
                .getCount();
        }
        console.log(audios);
        res.status(200).send({audios: audios});
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
            dataErrors: Array<keyof QueryData> = [],
            audios    : Array<Audio>           = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        audios = await getRepository(Audio).createQueryBuilder()
            .take(QueryData.take)
            .skip(QueryData.skip)
            .orderBy('id', "DESC")
            .getMany();

        res.status(200).send({audios: audios});
    }


    /**
     * потащить общее количесвто ВСЕХ аудио
     * ! Илья
     */
    public static async audiosAmountAll(req: Request, res: Response){

        let valueCount: number = 0;

        res.status(200).send({amount: 40});
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
    public static addAudioFile(req: Request, res: Response){

        let files: FileArray | undefined = req.files;

        console.log(files);

        res.status(200).send({msg: 'Success'});
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
        this.router.all('/remove',          this.removeAudio);
        
        return this.router;
    }
}

