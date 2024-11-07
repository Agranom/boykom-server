import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { IRequest } from '../../common/models/request.interface';
import { ObjectIdPipe } from '../../common/pipes/object-id.pipe';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { Grocery } from '../schemas/grocery.schema';
import { GroceryService } from '../services/grocery.service';

@Controller('groceries')
export class GroceryController {
  constructor(private groceryService: GroceryService) {}

  @Get()
  async getAll(@Req() req: IRequest): Promise<Grocery[]> {
    return this.groceryService.findAll(req.user.userId);
  }

  @Post()
  async create(@Body() createDto: CreateGroceryDto, @Req() req: IRequest) {
    return this.groceryService.create(createDto, req.user.userId, req.user.username);
  }

  @Put(':id')
  async updateById(
    @Param('id', ObjectIdPipe) id: string,
    @Body() createDto: CreateGroceryDto,
  ): Promise<Grocery | NotFoundException> {
    return this.groceryService.updateById(id, createDto);
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<{ id: string } | NotFoundException> {
    return this.groceryService.deleteById(id);
  }
}
