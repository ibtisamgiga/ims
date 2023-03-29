import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    console.log(createCategoryDto);
    const category = new Category();
    category.name = createCategoryDto.name;
    category.organizationId = user.organizationId;
    if (createCategoryDto.parentId) {
      const parentCategory = await this.CategoryRepository.findOneBy({
        id: createCategoryDto.parentId,
        organizationId: user.organizationId,
      });
      if (!parentCategory)
        throw new NotFoundException('category doesnot exist');
      category.parent = parentCategory;
    }
    return await this.CategoryRepository.save(category);
  }

  async getCategories(user: User) {
    return await this.CategoryRepository.find({
      relations: ['children','vendors','parent'],
      where: { organizationId: user.organizationId },
    });
  }

  async getCategoryById(id: number, user: User) {
    const category = await this.CategoryRepository.findOne({
      where: { id, organizationId: user.organizationId },
      relations: ['children','vendors','parent']
    });
    if (!category) throw new NotFoundException('category doesnot exist');
    return category;
  }
  async updateSubcategory(
    id: number,
    updateData: UpdateCategoryDto,
    user: User,
  ) {
    const { organizationId } = user;
    const found = await this.CategoryRepository.findOneBy({
      id,
      organizationId,
    });
    if (!found) throw new NotFoundException('category doesnot exist');
    const parentCategory = await this.CategoryRepository.findOne({
      where: { id },
    });
    const childCategory = this.CategoryRepository.create({
      name: updateData.name,
      organizationId,
      parent: parentCategory,
    });
    return this.CategoryRepository.save(childCategory);
  }

  async deleteCategory(id: number, user: User) {
    const { organizationId } = user;
    const category = await this.CategoryRepository.findOne({
      where: { id, organizationId },
      relations: { parent: true },
    });
    if (!category) throw new NotFoundException('category doesnot exist');
    if (category.parent === null) {
      const categories = await this.CategoryRepository.find({
        relations: { parent: true },
        where: [{ id }, { parent: { id } }],
      });
      return this.CategoryRepository.remove(categories);
    }
    return this.CategoryRepository.remove(category);
  }
  async findByIds(ids: number[]): Promise<Category[]> {
    const categories = await this.CategoryRepository.createQueryBuilder('category')
      .whereInIds(ids)
      .getMany();
    return categories;
  }
}
