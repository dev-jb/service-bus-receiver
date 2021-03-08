import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ServiceBusReceiverModule } from './service-bus-receiver/service-bus-receiver.module';
import * as dotenv from 'dotenv';
const path = `${__dirname}/./../dev.env`;
dotenv.config({ path: path });

@Module({
  imports: [
    ServiceBusReceiverModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
