import {Router as ExpressRouter} from 'express';

import AuthController from '../controllers/authController';


export default class Router{
    
    private static router: ExpressRouter = ExpressRouter();

    public static get routes(){
        this.router.use(AuthController.checkAccessToken);
        this.router.use('/auth', AuthController.routes());

        return this.router;
    }

}