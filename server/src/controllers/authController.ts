import { Router, Request, Response, NextFunction } from "express";
import ErrorMessage                  from "../libs/errorMessage";
import Query                         from "../libs/query";
import crypto                        from 'crypto-js';
import jwt, { JwtPayload }           from 'jsonwebtoken';
import config                        from "../config";


export default class AuthController{

    private static router: Router = Router();


    public static checkAccessToken(req: Request, res: Response, next: NextFunction){

        const
            authUrls: Array<string>      = ['/auth/login', '/auth/create-tokens'], 
            token   : string | undefined = req.headers.authorization;

        if(authUrls.includes(req.originalUrl)){next(); return}

        // if(!token) { res.status(401).send({msg: ErrorMessage.notFound('token')}); return; }

        try{
            // jwt.verify(token, config.secret.jwt);
            next();
        }catch(error){
            res.status(401).send({msg: error});
            return;
        }
    }


    private static createTokens(req: Request, res: Response){
        
        let
            refreshToken: string | undefined = req.cookies.refreshToken,
            id          : number             = 0,
            accessToken : string             = '';

        if(!refreshToken) { res.status(200).send({msg: 'token expired'}); return; }


        try {
            id = (jwt.verify(refreshToken, config.secret.jwt) as JwtPayload).id;
        } catch (error) {
            res.status(200).send({msg: 'token expired'});
            return;
        }

        // mysql.query(
        //     'select refreshToken from `user` where id = ?', [id]
        // ).then((value: any) => {

        //     if(value[0][0].refreshToken === refreshToken){
        //         accessToken  = jwt.sign({id: id}, config.secret.jwt, {expiresIn: '30m'});
        //         res.status(200).send({accessToken: accessToken});
        //         return;
        //     }

        //     res.status(400).send({msg: 'refreshToken expired'});
        // }).catch(error => {
        //     console.error(error);
        //     res.status(400).send({msg: error});
        //     return;
        // });
    }


    private static loginUser(req: Request, res: Response){

        interface QueryData{
            email   : string;
            password: string
        }

        let
            dataErrors  : Array<keyof QueryData> = [],
            refreshToken: string                 = '',
            accessToken : string                 = '',
            QueryData   : QueryData              = req.body,
            user        : any                    = {};

        dataErrors = Query.checkData(QueryData, ['email', 'password']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        // mysql.query(
        //     'select * from `user` where email = ?', [QueryData.email]
        // ).then((value: any) => {
            
        //     user = value[0][0];
            
        //     if(user == undefined) { res.status(401).send({errors: {email: 'Uncorrect email'}}); return } 
        //     if(user.password !== crypto.SHA512(QueryData.password).toString()) { res.status(401).send({errors: {password: 'Uncorrect password'}}); return; }
            
        //     refreshToken = jwt.sign({id: user.id}, config.secret.jwt, {expiresIn: '24h'});
        //     accessToken  = jwt.sign({id: user.id}, config.secret.jwt, {expiresIn: '30m'});

        //     res.cookie('refreshToken', refreshToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
        //     res.status(200).send({accessToken: accessToken, user: user});

        //     return mysql!.query('update `user` set refreshToken = ? where id = ?', [refreshToken, user.id]);
        // }).catch(error => {
        //     console.error(error);
        //     res.status(400).send({error: ErrorMessage.db()});
        // });
    }


    public static routes(): Router{
        this.router.post('/login', this.loginUser);
        this.router.post('/create-tokens', this.createTokens);
        
        return this.router;
    }
}