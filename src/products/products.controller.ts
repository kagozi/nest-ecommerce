import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, ApproveDTO } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('')
  findAllProducts() {
    return this.productsService.findAllProducts();
  }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req, // Get the request object with user info
  ) {
    const userId = req.user.id; // Assuming the user ID is in the request object

    return this.productsService.createProduct(createProductDto, userId);
  }


  @Get('product/:id')
  async findProductById(@Param('id') id: number) {
    return await this.productsService.findProductById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @Patch(':id')
  updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('approve/:id')
  approveProduct(@Param('id') id: number, @Body() approveDTO: ApproveDTO) {
    return this.productsService.approveProduct(id, approveDTO);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productsService.removeProduct(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: number) {
    return this.productsService.findCategoryById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    // Parse id to number
    const numericId = parseInt(id);
    return this.productsService.updateCategory(numericId, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('categories/:id')
  removeCategory(@Param('id') id: number) {
    return this.productsService.removeCategory(id);
  }


  @Get('search')
  async searchProducts(@Query('query') query: string) {
    console.log('Query:', query);
    return await this.productsService.searchProducts(query);
  }

  @Get('filter')
  filterProducts(
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 20,
  ) {
    if (Number(limit) > 20) {
      limit = 20;
    }
    return this.productsService.filterProducts(
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      Number(skip),
      Number(limit),
    );
  }
}