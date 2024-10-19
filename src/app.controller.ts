import { Controller, Get, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
  ClientKafka,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  // module의 ClientModule.register에 등록한 name을 맞춰준다.
  // nestjs에서 주입방법
  constructor(@Inject('KAFKA') private readonly kafkaProducer: ClientKafka) {}

  @Get()
  async sendMessage() {
    const message = { value: 'hello world' };
    await this.kafkaProducer.emit('cheonkyu', message);
  }

  @MessagePattern('cheonkyu')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response = originalMessage.value;

    console.log(originalMessage.value);
    console.log(message);

    console.log(context.getTopic());
    console.log(context.getArgs());
    console.log(context.getPartition());

    return response;
  }
}
