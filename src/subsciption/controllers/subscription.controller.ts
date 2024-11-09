import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { IRequest } from '../../common/models/request.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { Subscription } from '../models/subscription.model';
import { SubscriptionService } from '../services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post()
  async subscribe(
    @Body() subscription: Subscription,
    @Res() res: Response,
    @Req() req: IRequest,
  ): Promise<IStatusResponse> {
    return this.subscriptionService.createUserSubscription(req.user.userId, {
      ...subscription,
      userAgent: req.get('User-Agent') || 'unknown agent',
    });
  }
}
