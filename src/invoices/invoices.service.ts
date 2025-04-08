import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../orders/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import path from 'path';
// import { createInvoice } from 'node-invoice-generator';
const { PDFInvoice } = require('@h1dd3nsn1p3r/pdf-invoice');
@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId }, relations: ['user', 'items', 'items.product'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const location = path.join(__dirname, "/invoices/invoice_" + order.id + ".pdf"); 
    const invoiceData = {
      orderId: order.id,
      customer: {
        // @ts-ignore
        name: order.user.name,
        email: order.user.email,
      },
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      date: order.createdAt,
      path: location,
    };
    
    const invoice = new PDFInvoice(invoiceData);
	const pdf = await invoice.create()
    return pdf;
  }
}