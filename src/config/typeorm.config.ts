import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig:TypeOrmModuleOptions={
type:'postgres',
host:'localhost',
port:5432,
username:'postgres',
password:'test123',
database:'ims',
autoLoadEntities: true,
synchronize:true

}