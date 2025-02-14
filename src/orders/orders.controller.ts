import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch, UseFilters } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { StatusDto } from './dto/status.dto';
import { RpcCustomExceptionFilter } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', { ...createOrderDto })
    .pipe(
      catchError( err =>{ throw new RpcException(err) })
    );
  }

  @Get()
  @UseFilters(RpcCustomExceptionFilter)
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {

    try {
      const allOrder = await firstValueFrom(
        this.client.send('findAllOrders', { ...orderPaginationDto })
      )
      return allOrder
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const queryOrder = await firstValueFrom(
        this.client.send('findOneOrder', { id }),
      );
      return queryOrder;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.client.send('changeOrderStatus', { id, ...statusDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
