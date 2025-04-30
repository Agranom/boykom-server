import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { UnhandledExceptionBus } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppLogger } from '../../providers/logger/logger.service';

/**
 * Global service that monitors and handles exceptions from CQRS commands and events.
 * Based on the official NestJS CQRS documentation pattern.
 */
@Injectable()
export class CqrsExceptionMonitorService implements OnModuleDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly unhandledExceptionsBus: UnhandledExceptionBus,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CqrsExceptionMonitorService.name);

    // Subscribe to all unhandled exceptions from the CQRS system
    this.unhandledExceptionsBus.pipe(takeUntil(this.destroy$)).subscribe((exceptionInfo) => {
      const { exception, cause } = exceptionInfo;

      // this.logger.error(
      //   `Unhandled CQRS exception occurred in ${cause?.constructor?.name || 'unknown'}`,
      //   exception instanceof Error ? exception.stack : undefined,
      // );

      // Here you can add additional logic like:
      // - Notifying external monitoring systems
      // - Sending alerts
      // - Recording the error for retry later
      // - etc.

      // Important: The application will continue running (errors are just logged)
      // If you want to crash the app in severe cases, you can do:
      // if (exception instanceof SevereCriticalError) {
      //   process.exit(1);
      // }
    });

    this.logger.log('Global CQRS exception monitoring initialized');
  }

  /**
   * Clean up subscriptions when the module is destroyed
   */
  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
