import axios, { AxiosResponse } from "axios";
import { createReadStream } from "fs";
// import { promisify } from "util";

// const read = promisify(readFile);

const 
    FOLDER_ID = "b1g3r4lgbvftcmlle452",
    IAM_TOKEN = "b1gtl3g1nnh8e5mjgfoq";

const data = createReadStream("./audio/1.wav");

const headers = {
    "Authorization": `Bearer ${IAM_TOKEN}`
};

const params = {
    lang: "ru-RU",
    profanityFilter: false,
    format: "lpcm",
    folderId: FOLDER_ID,
}

axios.post(
    "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize", 
    data, 
    {
        headers,
        params
    }
).then((res: AxiosResponse<any>) => {
    const resData = res.data;
    console.log(resData);
}).catch(err => {
    console.error(err);
});