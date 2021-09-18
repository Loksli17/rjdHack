import {Entity, Column, PrimaryGeneratedColumn, ManyToMany,ManyToOne ,OneToMany, JoinTable} from 'typeorm';

import {IsEmail, MinLength, IsNotEmpty, MaxLength} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';
import Worker                                      from './Worker';
import TypeError                                   from './TypeError';   
import Audio                                       from './Audio';


@Entity()
export default class Violation{

    public changeFields(user: Partial<Violation>){
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    @IsNotEmpty()
    public word: string = 'default word';

    @Column()
    public timeCode: string = '00:00:00';

    @Column()
    @IsNotEmpty()
    public workerId?: number ; 
    
    @Column()
    @IsNotEmpty()
    public audioId?: number;

    @Column()
    @IsNotEmpty()
    public typeErrorId?: number;   

    @ManyToOne(() => Worker, worker => worker.violation)
    public workers?: Worker | number;

    @ManyToOne(() => Audio, audio => audio.violation)
    public audios?: Audio | number;

    @ManyToOne(() => TypeError, typeError => typeError.violation)
    public typeErrors?: TypeError | number;
}
    
