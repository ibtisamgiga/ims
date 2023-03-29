import { IsEmail } from 'class-validator';
import { Category } from 'src/category/entity/category.entity';
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
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  name: string;

  @Column()
  @Unique(['email'])
  @IsEmail()
  email: string;

  @Column()
  repName: string;

  @Column()
  @Unique(['repContactNo'])
  repContactNo: string;

  @Column()
  address: string;
  @Column()
  city: string;
  @Column()
  zip: string;
  @Column()
  country: string;
  @Column()
  bio: string;

  @OneToMany(() => User, (user) => user.organization, { eager: false })
  users: User[];

  @OneToMany(() => Category, (category) => category.organization, { eager: false })
  categories: Category[];

}
//crete org dto

// taskEntity
// @ManyToOne(()=>User,(user)=>user.tasks,{eager:false})
// user:User
// //using function ()=>Report
// //as result of circular dependency

// @Column()
// userId:number

// // userENtity
// @OneToMany(()=>Task,(task)=>task.user,{eager:true})
// tasks:Task[]
