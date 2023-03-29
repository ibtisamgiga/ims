import { IsEmail } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;


  @Column()
  otp: string;

  @Column({type: 'bigint'})
  expiresIn: number;
  

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
