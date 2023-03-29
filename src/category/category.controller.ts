import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { Role } from 'src/user/decorators/user-role.decorator';
import { User } from 'src/user/entity/user.entity';
import { Roles } from 'src/user/enums/roles.enum';
import { RolesGuard } from 'src/user/guards/role.gaurd';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Role(Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ) {
    console.log(user);
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get()
  @Role(Roles.Admin,Roles.Employee)
  @UseGuards(AuthGuard(), RolesGuard)
  getCategories(@GetUser() user: User) {
    return this.categoryService.getCategories(user);
  }

  @Get(':id')
  @Role(Roles.Admin,Roles.Employee)
  @UseGuards(AuthGuard(), RolesGuard)
  getCategory(@Param('id') id: string, @GetUser() user: User) {
    return this.categoryService.getCategoryById(+id, user);
  }

  @Patch(':id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() user: User,
  ) {
    return this.categoryService.updateSubcategory(+id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Role(Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  deleteCategory(@Param('id') id: string, @GetUser() user: User) {
    return this.categoryService.deleteCategory(+id, user);
  }
}
