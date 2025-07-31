import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orders: Order[] = [];

  createOrder(order: Order): Promise<Order> {
    return new Promise(resolve => {
      setTimeout(() => {
        order.id = this.generateOrderId();
        this.orders.push(order);
        resolve(order);
      }, 500);
    });
  }

  private generateOrderId(): string {
    return 'ord_' + Math.random().toString(36).substring(2, 15);
  }
}