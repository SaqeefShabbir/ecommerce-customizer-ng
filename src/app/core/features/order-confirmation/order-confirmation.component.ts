import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const routeState = this.route.snapshot.data['orderDetails'];
    const historyState = history.state?.orderDetails;

    if (routeState) {
      this.orderDetails = routeState;
    } else if (historyState) {
      this.orderDetails = historyState;
    } else {
      this.error = 'Could not load order details. Please check your email for confirmation.';
    }

    this.isLoading = false;
  }

  downloadReceipt() {
    console.log('Receipt downloaded for order:', this.orderDetails?.id);
    alert('Receipt download started!');
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }

  handleNavigation() {
    this.router.navigate(['/customize']);
  }
}