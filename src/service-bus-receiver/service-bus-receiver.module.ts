import { Module, OnModuleInit } from '@nestjs/common';
import { ProductModule } from 'src/products/products.module';
import { ProductService } from 'src/products/products.service';
import { ServiceBusReceiverService } from './service-bus-receiver.service';

@Module({
  controllers: [],
  imports: [ProductModule],
  providers: [ServiceBusReceiverService],
  exports: [ServiceBusReceiverService],
})
export class ServiceBusReceiverModule implements OnModuleInit {
  constructor(private serviceBusReceiverService: ServiceBusReceiverService) {}

  onModuleInit() {
    console.log(`Initialization...`);
    this.serviceBusReceiverService.receiveMessageAsync();
  }
}
