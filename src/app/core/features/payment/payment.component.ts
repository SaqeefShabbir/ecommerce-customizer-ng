import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/check-out.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../models/order';
import { environment } from '../../environments/environment';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  paymentMethod: 'stripe' | 'paypal' | 'credit-card' = 'stripe';
  displayedColumns: string[] = ['product', 'customization', 'price'];

  cartItems: Product[] = [];
  totalAmount: number = 0;
  isLoading = false;

  paypalButtonRendered = false;

  paymentError: string | null = null;

  creditCardPaymentForm: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.creditCardPaymentForm = this.fb.group({
      cardNumber: [''], 
      expiryDate: [''],
      cvc: ['', Validators.maxLength(4)], 
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
    this.totalAmount = this.cartService.getTotalCost();
  }

  ngAfterViewInit(): void {
    this.initializeStripe();
    this.loadPayPalScript();
  }

  ngOnDestroy(): void {
  }

  getFormControl(controlName: string): FormControl {
    return this.creditCardPaymentForm.get(controlName) as FormControl;
  }

  private async initializeStripe(): Promise<void> {
    await this.paymentService.initializeStripe('card-element');
  }

  private loadPayPalScript(): void {
    if (this.paymentMethod === 'paypal' && !window.paypal && !this.paypalButtonRendered) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
      script.id = 'paypal-script';
      script.onload = () => this.renderPayPalButton();
      document.body.appendChild(script);
    } else if (window.paypal && !this.paypalButtonRendered) {
      this.renderPayPalButton();
    }
  }

  onPaymentMethodChange(): void {
    if (this.paymentMethod === 'paypal') {
      setTimeout(() => {
        this.cleanupPayPalButton();
        this.loadPayPalScript();
      }, 2000);
    }
    if (this.paymentMethod === 'stripe') {
      setTimeout(() => {
        this.initializeStripe();
      }, 2000);
    }
  }

  private renderPayPalButton(): void {
    if (this.paypalButtonRendered) return;

    try 
    {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.totalAmount.toFixed(2),
                currency_code: 'USD'
              },
              description: 'Your order payment'
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          this.isLoading = true;
          try {
            const details = await actions.order.capture();
            await this.processPayment('paypal');
          } catch (err) {
            this.toastr.error('Payment failed', 'Error');
            console.error('PayPal error:', err);
          } finally {
            this.isLoading = false;
          }
        },
        onError: (err: any) => {
          this.toastr.error(err.message, 'PayPal Error');
          console.error('PayPal error:', err);
        }
      }).render('#paypal-button-container');
      
      this.paypalButtonRendered = true;
    } catch (error)
    {
      console.error('Paypal render error', error);
    }
  }

  private cleanupPayPalButton(): void {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = '';
    }
    const script = document.getElementById('paypal-script');
    if (script) {
      script.remove();
    }
    this.paypalButtonRendered = false;
  }

  formatCardNumber() {
    // Format as XXXX XXXX XXXX XXXX
    let value = (this.creditCardPaymentForm.get('cardNumber') as any).value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    
    (this.creditCardPaymentForm.get('cardNumber') as any).value = parts.join(' ');
  }

  formatExpiry() {
    // Format as MM/YY
    let value = (this.creditCardPaymentForm.get('expiryDate') as any).value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    (this.creditCardPaymentForm.get('expiryDate') as any).value = value;
  }

  isCardValid(): boolean {
    return (this.creditCardPaymentForm.get('cardNumber') as any).value.replace(/\s/g, '').length === 16 &&
           (this.creditCardPaymentForm.get('expiryDate') as any).value.length === 5 &&
           (this.creditCardPaymentForm.get('cvc') as any).value.length >= 3;
  }

  async processPayment(method: string): Promise<void> {
    this.isLoading = true;
    try {
      let paymentResult;
      
      switch (method) {
        case 'stripe':
          paymentResult = await this.paymentService.processStripePayment(
            this.totalAmount,
            'USD'
          );
          break;
          
        case 'paypal':
          paymentResult = await this.paymentService.processPayPalPayment(
            this.totalAmount
          );
          break;
          
        case 'credit-card':
          paymentResult = await this.paymentService.processCreditCardPayment(
            {
              ...this.creditCardPaymentForm.value
            },
            this.totalAmount,
            'USD'
          );
          break;
          
        default:
          throw new Error('Invalid payment method');
      }

      if (paymentResult.success) {
        await this.createOrder(this.parsePaymentMethod(method), paymentResult.paymentId);
        this.toastr.success('Payment processed successfully!', 'Success');
        this.router.navigate(['/order-confirmation'], {
          state: { 
            orderDetails: {
              id: paymentResult.paymentId,
              amount: this.totalAmount,
              currency: 'USD',
              date: new Date(),
              items: this.cartItems
            }
          }
        });
      } else {
        this.toastr.error(paymentResult.message, 'Payment Failed');
      }
    } catch (error) {
      this.toastr.error('Payment processing failed', 'Error');
      console.error('Payment error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async createOrder(paymentMethod: PaymentMethod | null, paymentId: string): Promise<void> {
    const order: Order = {
      items: this.cartService.getItems(),
      total: this.totalAmount,
      paymentMethod,
      paymentId,
      date: new Date(),
      id: ''
    };

    await this.checkoutService.createOrder(order);
    this.cartService.clearCart();
  }

  parsePaymentMethod(value: string): PaymentMethod | null {
    if (Object.values(PaymentMethod).includes(value as PaymentMethod)) {
      return value as PaymentMethod;
    }
    return null;
  }

  getCustomizationSummary(customization: any): string {
    const parts = [];
    if (customization.color) parts.push(`Color: ${customization.color}`);
    if (customization.texture) parts.push(`Texture: ${customization.texture.name}`);
    if (customization.engraving) parts.push(`Engraving: ${customization.engraving}`);
    return parts.join(', ');
  }
}