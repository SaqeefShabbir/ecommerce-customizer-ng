import { Routes } from '@angular/router';
import { ProductCustomizerComponent } from './core/features/customize/product-customizer/product-customizer.component';
import { CartComponent } from './core/features/cart/cart.component';
import { HomeComponent } from './core/features/home/home.component';
import { PaymentComponent } from './core/features/payment/payment.component';
import { OrderConfirmationComponent } from './core/features/order-confirmation/order-confirmation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customize', component: ProductCustomizerComponent },
  { path: 'cart', component: CartComponent },
  { 
    path: 'checkout/payment', 
    component: PaymentComponent,
    data: { title: 'Payment' }
  },
  { 
    path: 'order-confirmation', 
    component: OrderConfirmationComponent,
    data: { title: 'Order Confirmation' }
  },
  { path: '**', redirectTo: '' }
];