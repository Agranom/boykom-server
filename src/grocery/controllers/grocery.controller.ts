import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { IRequest } from '../../common/models/request.interface';
import { PatchGroceryDto } from '../dto/patch-grocery.dto';
import { Grocery } from '../entities/grocery.entity';
import { GroceryService } from '../services/grocery.service';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { GroceryFilterDto } from '../dto/grocery-filter.dto';

@Controller('groceries')
@ApiBearerAuth()
@ApiTags('groceries')
export class GroceryController {
  constructor(private groceryService: GroceryService) {}

  @Get()
  @ApiQuery({ name: 'inFridge', required: false })
  async getAll(@Req() req: IRequest, @Query() query: GroceryFilterDto): Promise<Grocery[]> {
    return this.groceryService.findAll(req.user.userId, query);
  }

  @Post()
  async create(@Body() createDto: CreateGroceryDto, @Req() req: IRequest) {
    return this.groceryService.createAndNotify(createDto, req.user.userId);
  }

  @Patch(':id')
  async updateById(
    @Param() { id }: FindByIdDto,
    @Body() dto: PatchGroceryDto,
    @Req() req: IRequest,
  ): Promise<Grocery> {
    return this.groceryService.updateById(id, dto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() { id }: FindByIdDto, @Req() req: IRequest): Promise<void> {
    return this.groceryService.deleteById(id, req.user.userId);
  }
}
