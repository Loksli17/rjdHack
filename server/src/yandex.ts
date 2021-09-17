import axios, { AxiosResponse } from "axios";
import { createReadStream } from "fs";
// import { promisify } from "util";

// const read = promisify(readFile);

const 
    FOLDER_ID = "b1g3r4lgbvftcmlle452",
    IAM_TOKEN = "t1.9euelZrMzYmUnZWbk52Rz47KnJOeju3rnpWal56Qz5KPiZSQnY-Pjp6byM_l8_cEb211-e9YA0I8_t3z90Qda3X571gDQjz-.85dRgzv0EXknkfi_TNeFR9lJVz_EahboXWFHo5rVt0U8SikrLqdybSZDhGw1jLa7IF5lb6mUrQ8zg4xrRQQdDA";

const data = createReadStream("./audio/1.wav");

const headers = {
    "Authorization": `Bearer ${IAM_TOKEN}`
};

// const params = {
//     lang: "ru-RU",
//     profanityFilter: false,
//     format: "lpcm",
//     folderId: FOLDER_ID,
//     sampleRateHertz: 8000
// }
const body = {
    config: {
        specification: {
            languageCode: "ru-RU",
            profanityFilter: false,
            audioEncoding: "LINEAR16_PCM",
            sampleRateHertz: 8000,
        }
    },
    audio: {
        uri: "AAA"
    }
}

axios.post(
    "https://transcribe.api.cloud.yandex.net/speech/stt/v2/longRunningRecognize", 
    data, 
    {
        headers
    }
).then((res: AxiosResponse<any>) => {
    const resData = res.data;
    console.log(resData);
    console.log("👍");
}).catch(err => {
    console.error(err.response.data);
    console.log("error 🤔");
});