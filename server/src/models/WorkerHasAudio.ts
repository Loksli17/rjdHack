import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany,ManyToOne, JoinTable} from 'typeorm';

import Audio                                       from './Audio';
import {IsEmail, MinLength, IsNotEmpty, MaxLength} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';
import Violation                                   from './Violation';



@Entity('workerHasAudio')
export default class WorkerHasAudio{

    public changeFields(user: Partial<WorkerHasAudio>){
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    @IsNotEmpty()
    public workerId: number = 0;

    @Column()
    @IsNotEmpty()
    public audioId: number = 0;

}