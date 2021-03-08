import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProductDto } from './products.dto';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  addProduct(@Body() product: ProductDto): any {
    const generatedId = this.productService.insertProduct(product);
    return { id: generatedId };
  }

  @Get()
  getAllProducts(): any {
    return this.productService.getAllProduct();
  }

  @Put()
  updateProduct(@Body() product: ProductDto) {
    return this.productService.updateProduct(product);
  }
}
