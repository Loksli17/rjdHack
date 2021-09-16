import express, {Request, Response, NextFunction} from 'express';

import config                           from './config';
import Router                           from './routes';
import cors                             from 'cors';
import fileUpload                       from 'express-fileupload';
import {createServer, Server}           from 'http';
import cookieParser                     from 'cookie-parser';
// import db                               from './models';



export class App{
    
    private static   instance: App;
    private          app     : express.Application;
    private readonly port    : number;
    private          server  : Server;

    
    private constructor(port: number = config.app.port){
        this.app    = express();
        this.port   = port;
        this.server = createServer(this.app);

        this.createMiddlewares();
        this.app.use('/', Router.routes);

        this.app.use(this.logErrors);
        this.app.use(this.errorHandler);
    }

    public static get Instance(): App{
        return this.instance || (this.instance = new this());
    }

    public async init(){
        this.server.listen(3000, () => console.log(`Vue learn was started on port: ${this.port}. Stop it now?`));
    }


    private logErrors(err: Error, req: Request, res: Response, next: NextFunction){
        console.error(err);
        next(err);
    }

    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
        console.error(err);
        res.status(500).send({error: err});
    }

    private createMiddlewares(){
        this.app.use(cors(
            {
                origin        : config.cors.origin,
                methods       : config.cors.methods,
                credentials   : true,
                exposedHeaders: ['set-cookie']
            }
        ));
        this.app.use(cookieParser(config.secret.session));
        this.app.use(express.json({limit: '30mb'}));
        this.app.use(express.static('public'));
        this.app.use(express.urlencoded({extended: true, limit: '30mb'}));
        this.app.use(fileUpload());
    }
    
}

const app = App.Instance;
app.init();