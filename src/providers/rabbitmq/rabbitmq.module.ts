import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GROCERY_RMQ_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('RABBITMQ_GROCERY_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
      // …register more ClientProxies here for other queues
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
