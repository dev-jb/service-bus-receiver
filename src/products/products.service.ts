import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './products.dto';
import { Product, ProductDocument, ProductSchema } from './products.model';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';

@Injectable()
export class ProductService {
  products: Product[] = [];
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async insertProduct(productDto: ProductDto) {
    productDto.dateTimeReceiver = new Date();
    const newProduct = new this.productModel(productDto);
    const result = await newProduct.save();
    console.log('RESULT --->', result);
    return 'productId';
  }

  async getAllProduct() {
    try {
    } catch (err) {
      console.log('ERROR RECEIVING.....', err);
    }
  }

  async updateProduct(productDto: ProductDto) {
    const fetchedProduct = await this.findProduct(productDto.id);

    if (fetchedProduct == null)
    {
      return null
    } else{

    if (productDto.title) {
        fetchedProduct.title = productDto.title;
    }
    if (productDto.desc) {
      fetchedProduct.desc = productDto.desc;
    }
    if (productDto.price) {
      fetchedProduct.price = fetchedProduct.price - productDto.price;
    }
    const updatedProduct = new this.productModel(fetchedProduct);
    const result = await updatedProduct.save();

    console.log('RESULT --->', result);
    return 'productId';
    }

  }

  private async findProduct(productId) {
    let product = [];
    try {
      console.log(mongoose.Types.ObjectId.isValid(productId));

      product = await this.productModel.find({ id: productId });
      // product = await this.productModel.findOne({
      //   _id: mongoose.Types.ObjectId(productId),
      // });
    } catch (error) {
      console.log('ERRR------------------__>' + error);
      throw new NotFoundException('Could not find product', error);
    }
    if (product.length == 0) {
      return null
    }else {
      return product[0];
    }
  }
}
