import express, {Request, Response, NextFunction} from 'express';
import os                                         from 'os';
import cluster, { Worker }                        from 'cluster';


const app: express.Application = express();

app.use((req, res, next) => {
    if(cluster.isWorker) console.log(`worker ${cluster.worker!['id']} handle request`);
    next();
})


app.post('/test', (req: Request, res: Response) => {
    res.status(200).send({kek: 'lol'});
});


if(cluster.isMaster){

    let cpus = os.cpus().length;
    
    for(let i = 0; i < cpus; i++){ console.log(); cluster.fork(); }

    cluster.on('exit', (worker: Worker, code: number) => {
        console.log(`worker ${worker.id} finished. Exit code: ${code}`);
        app.listen(3001, () => {`worker ${cluster.worker!['id']} launched`});
    });

} else {
    app.listen(3001, () => console.log(`Worker ${cluster.worker!['id']} launched`));
}