import { Module } from '@nestjs/common';
import { GcpHttpService } from './services/gcp-http.service';

@Module({
  providers: [GcpHttpService],
  exports: [GcpHttpService],
})
export class GcpModule {}
