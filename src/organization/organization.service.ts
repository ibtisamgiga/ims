import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { Organization } from './entity/organization.entity';

@Injectable()
export class OrganizationService {

  
  @InjectRepository(Organization)
  private organizationRepository: Repository<Organization>;

  async createOrganization(organizationData: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(organizationData);
    try {
      return await this.organizationRepository.save(organization);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('organization already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteOrganization(id: number) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) throw new NotFoundException('Organization Not Found');
    return {
      user: await this.organizationRepository.remove(organization),
      message: 'organization Deleted',
    };
  }

  async getOrganizations() {
    const query =
      this.organizationRepository.createQueryBuilder('organization');
    const organizations = await query.getMany();
    return organizations;
  }
}
