import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { IRequest } from '../../common/models/request.interface';
import { UpsertGroceryDto } from '../dto/upsert-grocery.dto';
import { Grocery } from '../entities/grocery.entity';
import { GroceryService } from '../services/grocery.service';

@Controller('groceries')
export class GroceryController {
  constructor(private groceryService: GroceryService) {}

  @Get()
  async getAll(@Req() req: IRequest): Promise<Grocery[]> {
    return this.groceryService.findAll(req.user.userId);
  }

  @Post()
  async create(@Body() createDto: UpsertGroceryDto, @Req() req: IRequest) {
    return this.groceryService.createAndNotify(createDto, req.user.userId);
  }

  @Put(':id')
  async updateById(@Param() { id }: FindByIdDto, @Body() dto: UpsertGroceryDto): Promise<Grocery> {
    return this.groceryService.updateById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() { id }: FindByIdDto): Promise<void> {
    return this.groceryService.deleteById(id);
  }
}
