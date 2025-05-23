import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ApproveDTO, UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private userService: UsersService, // Inject the UsersService
  ) { }

  async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;

    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const user = await this.userService.findOneById(userId)

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // If the user is an admin, set the sellling price equal to the cost price and set the status to approved
    if (user.role === 'admin') {
      rest.sellingPrice = rest.price;
      rest.isApproved = true;
    }

    const product = this.productsRepository.create({
      ...rest,
      category,
      user, // Add the user relationship
    });

    return this.productsRepository.save(product);
  }



  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['category'] });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = updateProductDto;
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async approveProduct(id: number, approveDTO: ApproveDTO): Promise<Product> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // check if the selling price is lower than the cost price
    if (approveDTO.sellingPrice < product.price) {
      throw new BadRequestException('Selling price cannot be lower than cost price');
    }

    Object.assign(product, approveDTO);
    return this.productsRepository.save(product);
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['products'] });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }


  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    console.log({
      id,
      updateCategoryDto
    })
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }

  async searchProducts(query: string): Promise<any> {
    // return query
    return await this.productsRepository.createQueryBuilder('product')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async filterProducts(
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    skip = 0,
    limit = 20,
  ): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (categoryId) {
      queryBuilder.andWhere('product.category.id = :categoryId', { categoryId });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating) {
      queryBuilder.andWhere('product.rating >= :minRating', { minRating });
    }

    return queryBuilder
      .skip(skip)
      .take(limit)
      .getMany();
  }

}
