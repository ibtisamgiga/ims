import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCompalintDto } from './dtos/create-complaint.dto';
import { updateComplaintStatusDto } from './dtos/update-complaint-status.dto';
import { Complaint } from './entity/complaint.entity';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private ComplaintRepository: Repository<Complaint>,
  ) {}

  async createCompliant(createComplaintDto: CreateCompalintDto, user: User) {
    const { description, images } = createComplaintDto;

    const compalint = this.ComplaintRepository.create({
      images,
      description,
      userId: user.id,
    });
    try {
      return await this.ComplaintRepository.save(compalint);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getComplaints(user: User) {
    const role = user.role == 'superadmin' ? 'admin' : 'employee';
    const organizationId = user.role == 'admin' ? user.organizationId : null;
    const compalints = await this.ComplaintRepository.find({
      where: { user: { role: role, organizationId } },
      relations: ['user', 'user.organization'],
    });
    const myCompalints = await this.ComplaintRepository.find({
      where: { user: { role: user.role, id: user.id } },
      relations: ['user', 'user.organization'],
    });
    if (user.role == 'admin') {
      return { compalints, myCompalints };
    } else if (user.role == 'employee') {
      return myCompalints;
    }
    return compalints;
  }

  async getComplaintById(id: number, user: User) {
    const organizationId = user.role == 'admin' ? user.organizationId : null;
    const complaint = await this.ComplaintRepository.findOne({
      where: { id }, // user: { role: role, organizationId }
      relations: ['user', 'user.organization'],
    });
    if (!complaint) throw new NotFoundException('complaint Not Found');
    return complaint;
  }

  async updateComplaintStatus(
    id: number,
    updatedStatus: updateComplaintStatusDto,
    user: User,
  ) {
    const { status } = updatedStatus;
    const complaint = await this.getComplaintById(id, user);
    complaint.status = status;
    return await this.ComplaintRepository.save(complaint);
  }
}
