import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from '../../common/models/request.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionService } from '../services/subscription.service';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body() dto: CreateSubscriptionDto,
    @Req() req: IRequest,
  ): Promise<IStatusResponse> {
    return this.subscriptionService.createOrUpdate(
      req.user.userId,
      dto,
      req.get('User-Agent') || 'unknown agent',
    );
  }
}
