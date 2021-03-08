import * as mongoose from 'mongoose';
// export const ProductSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   desc: { type: String, required: true },
//   price: { type: Number, required: true },
// });

// export interface Product extends mongoose.Document {
//   id: string;
//   title: string;
//   desc: string;
//   price: number;
// }
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  desc: string;

  @Prop()
  price: number;

  @Prop()
  dateTimeSender: Date;

  @Prop()
  dateTimeReceiver: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
