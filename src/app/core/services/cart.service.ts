import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Product[]>(this.loadInitialCart());
  cartItems$ = this.cartItems.asObservable();

  private loadInitialCart(): Product[] {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage', error);
      return [];
    }
  }

  private saveCart(items: Product[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItems.value;
    const updatedItems = [...currentItems, product];
    this.cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  removeFromCart(index: number): void {
    const currentItems = this.cartItems.value;
    currentItems.splice(index, 1);
    this.cartItems.next([...currentItems]);
    this.saveCart([...currentItems]);
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  getItems(): Product[] {
    return this.cartItems.value;
  }

  getTotalCost(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price, 0);
  }
}