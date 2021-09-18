
import { getRepository } from "typeorm";
import TypeError from "../models/TypeError";

export interface ErrorLexem{
    timeCode: string;
    word: string;
    typeErrorId: number;
}


export default async (words: string, audioId: number): Promise<Array<ErrorLexem>> => {

    let 
        typeErrors: Array<TypeError>  = await getRepository(TypeError).find(),
        errors    : Array<ErrorLexem> = [],
        wordsArray: Array<string>     = words.split(' ');

    const sheme: Record<string, any> = {
        gretting: ['машинист поезда номер'],
        arrival : ['на приблежении к станции'],

    };

    if(wordsArray[0] + '' + wordsArray[1] + '' + wordsArray[2] != sheme.gretting){

        const error: ErrorLexem = {
            timeCode: '00:00',
            word: wordsArray[0],
            typeErrorId: typeErrors[0].id!,
        };

        errors.push(error);
    }

    if(wordsArray[4] + '' + wordsArray[5] + '' + wordsArray[6] != sheme.gretting){

        const error: ErrorLexem = {
            timeCode   : '04:0',
            word       : wordsArray[4] + " " + wordsArray[5] + " " + wordsArray[6],
            typeErrorId: typeErrors[1].id!,
        };

        errors.push(error);
    }


    return errors;
}