import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Response, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ObjectIdPipe } from '../../common/pipes/object-id.pipe';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { Grocery } from '../schemas/grocery.schema';
import { GroceryService } from '../services/grocery.service';

@Controller('groceries')
export class GroceryController {
  constructor(private groceryService: GroceryService) {
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<Grocery[]> {
    return this.groceryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDto: CreateGroceryDto, @Response() response: any): Promise<void> {
    const result = await this.groceryService.create(createDto);
    response.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateById(@Param('id', ObjectIdPipe) id: string, @Body() createDto: CreateGroceryDto): Promise<Grocery | NotFoundException> {
    return this.groceryService.updateById(id, createDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteById(@Param('id', ObjectIdPipe) id: string): Promise<{ id: string } | NotFoundException> {
    return this.groceryService.deleteById(id);
  }
}
