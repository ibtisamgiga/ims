import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { Complaint } from './entity/complaint.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([Complaint]),UserModule],
  controllers: [ComplaintController],
  providers: [ComplaintService]
})
export class ComplaintModule {}
