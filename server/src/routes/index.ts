import {Router as ExpressRouter} from 'express';

import AuthController   from '../controllers/authController';
import AudioController  from '../controllers/audioController';
import WorkerController from '../controllers/workerController';

export default class Router{
    
    private static router: ExpressRouter = ExpressRouter();

    public static get routes(){
        this.router.use(AuthController.checkAccessToken);
        this.router.use('/auth',   AuthController.routes());
        this.router.use('/audio',  AuthController.routes());
        this.router.use('/worker', AuthController.routes());

        return this.router;
    }

}