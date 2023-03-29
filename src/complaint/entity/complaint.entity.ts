import { IsEmail } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn({type:'date'})
  submissionDate: Date;


  @Column({default:'Pending'})
  status: string;
  @Column()
  images: string;

  @ManyToOne(() => User, (user) => user.compalints, {
    eager:false,
  })
  user:User;
  
  @Column()
  userId: number;

  @Column()
  description: string;
}
