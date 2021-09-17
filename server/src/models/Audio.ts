import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable} from 'typeorm';

import {IsEmail, MinLength, IsNotEmpty, MaxLength} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';


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
}