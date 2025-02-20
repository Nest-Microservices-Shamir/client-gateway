import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}
  
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto){

    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'product.create' }, { ...createProductDto })
      );
      return product;
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Get()
  async getAllProducts(@Query() paginationDto: PaginationDto ){

    try {
      const productAll = await firstValueFrom(
        this.client.send({ cmd: 'product.get_all' }, { ...paginationDto })
      );
      return productAll;
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Get(':id')
  async getOneProduct(@Param('id', ParseUUIDPipe) id: string){

    try {
      const product = await firstValueFrom(
        this.client.send({ cmd: 'product.get_by_id' }, { id })
      );
      return product;
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto
  ){

    try {
      const productAll = await firstValueFrom(
        this.client.send({ cmd: 'product.update' }, { id, ...updateProductDto })
      );
      return productAll;
    } catch (error) {
      throw new RpcException(error)
    }
    
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string){

    try {
      const productAll = await firstValueFrom(
        this.client.send({ cmd: 'product.delete_by_id' }, { id })
      );
      return productAll;
    } catch (error) {
      throw new RpcException(error)
    }

  }

}
