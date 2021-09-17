import axios, { AxiosResponse } from "axios";


export default class AudioService{

    public static async getAll(take: number, skip: number){
        const res: AxiosResponse = await axios.post('audio/all-illegal', {take: take, skip: skip});
        console.log('all audios:', res.status)
        return res.data.audios;
    }

}