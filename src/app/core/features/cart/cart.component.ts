import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatRadioModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  displayedColumns: string[] = ['product', 'customization', 'price', 'actions'];
  cartItems: Product[] = [];
  isLoading = false;
  isCheckingOut = false;

  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load cart items', 'Error');
      }
    });
  }

  removeItem(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.cartService.removeFromCart(index);
        this.toastr.success('Item removed from cart', 'Success');
      }
    });
  }

  clearCart(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear Cart',
        message: 'Are you sure you want to remove all items from your cart?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.cartService.clearCart();
        this.toastr.success('Cart cleared', 'Success');
      }
    });
  }

  getTotalCost(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  async checkout(): Promise<void> {
    this.isCheckingOut = true;

    if (this.cartItems.length === 0) {
      this.toastr.warning('Your cart is empty', 'Warning');
      return;
    }

    // Pass cart data via navigation extras
    this.router.navigate(['/checkout/payment']);

    this.isCheckingOut = false;
  }

  getCustomizationSummary(customization: any): string {
    const parts = [];
    if (customization.color) parts.push(`Color: ${customization.color}`);
    if (customization.texture) parts.push(`Texture: ${customization.texture.name}`);
    if (customization.engraving) parts.push(`Engraving: ${customization.engraving}`);
    return parts.join(', ');
  }
}