import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable} from 'typeorm';

import {IsEmail, MinLength, IsNotEmpty, MaxLength} from 'class-validator';
import {IsUniq}                                    from '@join-com/typeorm-class-validator-is-uniq';
import Violation from './Violation';

@Entity('typeError')
export default class TypeError{

    public changeFields(user: Partial<TypeError>){
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    @IsNotEmpty()
    public name: string = 'default name'; 

    @OneToMany(() => TypeError, typeError => typeError.violation)
    public violation?: Array<Violation> | undefined;
}