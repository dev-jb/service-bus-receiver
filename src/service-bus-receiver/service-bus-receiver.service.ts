import {
  delay,
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceivedMessage,
} from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { json } from 'express';
import { ProductService } from 'src/products/products.service';

import * as dotenv from 'dotenv';
const path = `${__dirname}/../../dev.env`;
dotenv.config({ path: path });

// Service Bus Connection String
const connectionString = process.env.SB_CONNECTION_STRING;
// Message to show during internal server error to user
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';

const topicName = 'topic-product';
const subscriptionName = 'subs-product';

@Injectable()
export class ServiceBusReceiverService {
  constructor(private readonly productService: ProductService) {}


  async receiveMessageAsync(): Promise<any> {
    console.log('ON ServiceBusReceiverService');
    const sbClient = new ServiceBusClient(connectionString);

    /**
     * Initialize createReceiver Instance
     * Receive Mode: PeerLock
     * Message is not auto deleted from topic.
     * Message is only deleted once completeMessage() is called.
     * Note: Auto Delete is enabled on both peerLock and receiveAndDelete mode on receiving message through receiver.subscribe()
     */
    const receiver = sbClient.createReceiver(topicName, subscriptionName, {
      receiveMode: 'peekLock',
    });

    const messageList = receiver.getMessageIterator()

    console.log("RECEIVED MESSAGES===>"+ messageList)

    /**
     * Using message iterator to receive message.
     * Note: Message is not auto deleted from topic. Message is only deleted once completeMessage() is called.
     */
    for await (const message of receiver.getMessageIterator({})) {
      const start = Date.now();

      // your code here
      console.log('RECEIVED========>', message.body);
      switch (message.body.serviceType) {
        case 'insertProduct':
          console.log('INSIDE ADD');
          await this.productService.insertProduct(message.body.body);
          await receiver.completeMessage(message);

          break;
        case 'updateProduct':
          console.log('INSIDE UPDATE');
          const resp = await this.productService.updateProduct(message.body.body);
          console.log('RESP--->' + resp);
          await receiver.completeMessage(message);

          break;
        default:
          console.log('NOT FOUND');
      }
      console.log('Time taken==', Date.now() - start);
    }

    /**
     * Using receive message on batch
     */
    // receiver.receiveMessages(100).then((receivedDataList) => {
    //   receivedDataList.forEach((receivedData) => {
    //     console.log('RECEIVED DATAS===>' + JSON.stringify(receivedData.body));
    //     receiver.completeMessage(receivedData);
    //   });
    // });
    // receiver.subscribe()
    // const serviceBusMessageList :ServiceBusReceivedMessage[]

    /**
     * Using subscribe to receive message.Note: Message is auto deleted from topic once messaged received
     */
    // console.log('RECEIVED DATA===>' + receivedData);
    // const myMessageHandler = async (
    //   messageReceived: ServiceBusReceivedMessage,
    // ) => {
    //   // const start = Date.now();
    //   // const sbMessage = messageReceived;
    //   // sbMessage = messageReceived;
    //   console.log(messageReceived.messageId);
    //   // console.log(sbMessage.body);
    //   // const productService = new ProductService();
    //   // console.log('ERROR--->', error);
    //   await delay(3000);
    //   switch (messageReceived.body.serviceType) {
    //     case 'insertProduct':
    //       console.log('INSIDE ADD');
    //       await this.productService.insertProduct(messageReceived.body.body);
    //
    //       break;
    //     case 'updateProduct':
    //       console.log('INSIDE UPDATE');
    //       await this.productService.updateProduct(messageReceived.body.body);
    //       break;
    //   }
    //   console.log('Time taken==', Date.now() - start);
    //   await receiver.close();
    // };
    // // function to handle any errors
    // const myErrorHandler = async (error) => {
    //   console.log('ERROR--->', error);
    // };
    // //
    // // // receiver.receiveMessages()
    // receiver.subscribe(
    //   {
    //     processMessage: myMessageHandler,
    //     processError: myErrorHandler,
    //   },
    //   { maxConcurrentCalls: 100 },
    // );
  }
}
