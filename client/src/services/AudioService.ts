import axios, { AxiosResponse } from "axios";


export default class AudioService{


    public static async getAll(take: number, skip: number){
       
        const res: AxiosResponse = await axios.post('audio/all-illegal', {take: take, skip: skip});
        
        res.data.audios = res.data.audios.map((item: any) => {
            item.isChecked = !item.isChecked ? "Обработан" : "Не обработан";
            return item;
        });

        return res.data.audios;
    }


    public static async removeOne(id: number){
        const res: AxiosResponse = await axios.post('audio/remove', {})
    }

    public static async illegalCount(){
        const res = await axios.post('audio/illegal-count');
        return res.data.countValue;
    }
    

}