import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable} from 'typeorm';

import Worker                                              from './Worker';
import {IsEmail, MinLength, IsNotEmpty, MaxLength, isPort} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';

import Violation from './Violation';

@Entity()
export default class Audio{

    public changeFields(user: Partial<Audio>){
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    @IsNotEmpty()
    public fileAudio: string = 'default.wav';

    @Column()
    @IsNotEmpty()
    public text: string = 'Текст, Текст, Текст, Текст, Текст, Текст, Текст';

    @Column()
    public isChecked: boolean = false;

    public isIllegal: boolean = false;

    public violationCount: number  = 0 ; 

    @ManyToMany(() => Worker, worker => worker.audios)
    public workers?: Array<Worker> | undefined;

    @OneToMany(() => Audio, audio => audio.violation)
    public violation?: Array<Violation> | undefined;
}