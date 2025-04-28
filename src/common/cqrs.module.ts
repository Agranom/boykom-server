import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from '../providers/logger/logger.module';
import { CqrsExceptionMonitorService } from './services/cqrs-exception-monitor.service';

/**
 * Module for CQRS functionality that's shared across the entire application.
 * Provides global exception handling and monitoring for CQRS.
 */
@Module({
  imports: [CqrsModule, LoggerModule],
  providers: [CqrsExceptionMonitorService],
  exports: [CqrsModule],
})
export class CommonCqrsModule {}
