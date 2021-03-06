import axios, { AxiosResponse } from "axios";
import moment                   from "moment";
import { LoadingFile }          from '../components/FileUpload/FileUpload.vue';


moment.locale("ru");

export default class AudioService{


    public static async getAllIllegal(take: number, skip: number){
       
        const res: AxiosResponse = await axios.post('audio/all-illegal', {take: take, skip: skip});
        
        res.data.audios = res.data.audios.map((item: any) => {
            item.isChecked = item.isChecked ? "Обработан" : "Не обработан";
            item.date      = moment(item.date).format('MMMM Do YYYY');
            item.date      = item.date[0].toUpperCase() + (item.date.slice(1, (item.date.length)));
            return item;
        });

        return res.data.audios;
    }


    public static async removeOne(id: number){
        const res: AxiosResponse = await axios.post('audio/remove', {id: id});
        return res;
    }

    public static async illegalCount(){
        const res = await axios.post('audio/illegal-count');
        return res.data.countValue;
    }


    public static async getOne(id: number){
        const res = await axios.post('audio/one', {id: id});

        res.data.audio.date = moment(res.data.audio.date).format('MMMM Do YYYY');
        res.data.audio.date = res.data.audio.date[0].toUpperCase() + (res.data.audio.date.slice(1, (res.data.audio.date.length)));

        res.data.audio.isChecked        = res.data.audio.isChecked ? "Обработан" : "Не обработан";
        res.data.audio.isIllegalContent = res.data.audio.isIllegal ? "С нарушением регламента" : "Без нарушения";

        return res.data.audio;
    }


    public static async fileUpload(loadingFile: LoadingFile){
        
        const fd: FormData = new FormData();
        fd.append('audio', loadingFile.file);
        
        const res = await axios.post('audio/add-audio-file', fd, {
            onUploadProgress: (e) => {
                loadingFile.progress = Math.floor(e.loaded * 100 / e.total);
            }
        });

        return res;
    }


    public static async getAll(take: number, skip: number){
        
        const res: AxiosResponse = await axios.post('audio/all', {take: take, skip: skip});
        
        res.data.audios = res.data.audios.map((item: any) => {
            item.isChecked        = item.isChecked ? "Обработан" : "Не обработан";
            item.isIllegalContent = item.isIllegal ? "С нарушением регламента" : "Без нарушения";
            item.date             = moment(item.date).format('MMMM Do YYYY');
            item.date             = item.date[0].toUpperCase() + (item.date.slice(1, (item.date.length)));
            return item;
        });

        return res.data.audios;
    }

    public static async count(){
        const res = await axios.post('audio/count');
        console.log(res.data.countValue);
        return res.data.countValue;
    }
    
}