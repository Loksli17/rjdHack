
import { getRepository } from "typeorm";
import TypeError from "../models/TypeError";

export interface ErrorLexem{
    timeCode: string;
    word: string;
    typeErrorId: number;
    typeError: string;
}


export default async (words: string, audioId: number): Promise<Array<ErrorLexem>> => {

    let 
        typeErrors: Array<TypeError>  = await getRepository(TypeError).find(),
        errors    : Array<ErrorLexem> = [],
        wordsArray: Array<string>     = words.split(' ');

    const sheme: Record<string, any> = {
        gretting: ['машинист поезда номер'],
        arrival : ['на приблежении к станции'],
        way     : ['маршрут на проход по главному пути готов'],
    };

    if(wordsArray[0] + '' + wordsArray[1] + '' + wordsArray[2] != sheme.gretting){

        const error: ErrorLexem = {
            timeCode   : '00:00',
            word       : wordsArray[0],
            typeErrorId: typeErrors[0].id!,
            typeError  : typeErrors[0].name,
        };

        errors.push(error);
    }

    if(wordsArray[4] + '' + wordsArray[5] + '' + wordsArray[6] != sheme.gretting){

        const error: ErrorLexem = {
            timeCode   : '04:00',
            word       : wordsArray[4] + " " + wordsArray[5] + " " + wordsArray[6],
            typeErrorId: typeErrors[1].id!,
            typeError  : typeErrors[1].name,
            // way        : 
        };

        errors.push(error);
    }


    return errors;
}