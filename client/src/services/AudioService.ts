import axios, { AxiosResponse } from "axios";
import moment                   from "moment";


export default class AudioService{


    public static async getAllIllegal(take: number, skip: number){
       
        const res: AxiosResponse = await axios.post('audio/all-illegal', {take: take, skip: skip});

        moment.locale("ru");
        
        res.data.audios = res.data.audios.map((item: any) => {
            item.isChecked = !item.isChecked ? "Обработан" : "Не обработан";
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
    
}