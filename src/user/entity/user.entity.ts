import { IsEmail } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from 'src/organization/entity/organization.entity';
import { Complaint } from 'src/complaint/entity/complaint.entity';
import { Item } from 'src/item/entity/item.entity';
import { Request } from 'src/request/entity/request.entity';

@Entity()
// @Unique(['email','privateEmail'])
//@Index(['email','privateEmail'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['email'])
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;



  @Column({ nullable: true })
  // @Unique(['privateEmail'])
  @IsEmail()
  privateEmail: string;

  @Column({ nullable: true })
  @Unique(['contactNo'])
  contactNo: string;
  @ManyToOne(() => Organization, (organization) => organization.users, {
    eager: false,
  })
  organization: Organization;
  
  @Column()
  organizationId: number;
  //^[0-9]+$
  @Column()
  role: string;


  @OneToMany(() => Complaint, (complaint) => complaint.user, { eager: false })
  compalints: Complaint[];

  @OneToMany(() => Item, (item) => item.user, { eager: false })
  items: Item[];

  @OneToMany(() => Request, (request) => request.user, { eager: false })
  requests: Request[];
  //function to validate encrypted password
  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

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
