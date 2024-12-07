import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { AppConfig } from '../../../config/app.config';

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext, private configService: ConfigService<AppConfig>) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const origin = this.configService.getOrThrow<string>('origin');
    const serverOptions: Partial<ServerOptions> = {
      ...(options || {}),
      cors: {
        origin,
      },
    };

    return super.createIOServer(port, serverOptions);
  }
}
