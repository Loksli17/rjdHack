import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany,ManyToOne, JoinTable} from 'typeorm';

import Audio                                       from './Audio';
import {IsEmail, MinLength, IsNotEmpty, MaxLength} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';
import Violation                                   from './Violation';


@Entity()
export default class Worker{

    public changeFields(user: Partial<Worker>){
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    @IsNotEmpty()
    public firstName: string = 'Lesha';

    @Column()
    @IsNotEmpty()
    public lastName: string = 'Lesha';

    @Column()
    @IsEmail()
    @IsNotEmpty()
    @IsUniq()
    public email: string = '123@mail.ru';

    // @Column()
    // @MinLength(7)
    // @IsNotEmpty()
    // public password: string = '12345678';

    @Column()
    @IsNotEmpty()
    public phone: string = '89241098357';

   
    @ManyToMany(() => Audio, audio => audio.workers)
    @JoinTable({
        name              : "workerHasAudio",
        joinColumns       : [{name: 'workerId'}],
        inverseJoinColumns: [{name: 'audioId'}],
    })
    public audios?: Array<Audio> | undefined;

    
    @OneToMany(() => Worker, worker => worker.violation)
    public violation?: Array<Violation> | undefined;

}
    