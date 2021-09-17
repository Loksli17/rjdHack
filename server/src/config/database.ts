import {getConnectionManager} from 'typeorm';
import config                 from '../config';
import Audio                  from '../models/Audio';
import Worker                 from '../models/Worker';


const
    connectionManager = getConnectionManager(),
    
    connection = connectionManager.create({
        name    : 'default',
        type    : 'mysql',
        host    : 'localhost',
        port    : config.db.port,
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        entities: [
            Audio,
            Worker,
        ],
    }),

    init = async (): Promise<void> => {
        try{
            await connection.connect();
            console.log(`Connection to ${config.db.name} was successfully. User: ${config.db.user}`);
        }catch(error: any){
            console.error(error);   
        }
    };

export default init;