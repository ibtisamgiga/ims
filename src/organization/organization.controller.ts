import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { Role } from 'src/user/decorators/user-role.decorator';
import { User } from 'src/user/entity/user.entity';
import { Roles } from 'src/user/enums/roles.enum';
import { RolesGuard } from 'src/user/guards/role.gaurd';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@UseGuards(AuthGuard())
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post()
  @Role(Roles.SuperAdmin)
  @UseGuards(RolesGuard)
  async createOrganization(@Body() createOrgDto: CreateOrganizationDto) {
    return await this.organizationService.createOrganization(createOrgDto);
  }

  @Delete('/:id')
  @Role(Roles.SuperAdmin)
  @UseGuards(RolesGuard)
  async deleteOrganization(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.deleteOrganization(id);
  }


  @Get()
  @Role(Roles.SuperAdmin)
  @UseGuards(RolesGuard)
  getOrganization(@GetUser() user:User) {
    console.log(user)
    return this.organizationService.getOrganizations();
  }
}
