import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../environments/environment';

declare var paypal: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private stripeElements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  error: string | null = null;
  success = false;
  paymentId: string | null = null;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  async initializeStripe(elementId: string): Promise<boolean> {
    const stripe = await this.stripePromise;
    if (!stripe) return false;

    const elements = stripe.elements();
    this.stripeElements = elements;
    
    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
      }
    };

    this.cardElement = elements.create('card', { style });
    this.cardElement.mount(`#${elementId}`);
    return true;
  }

  async processStripePayment(amount: number, currency: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe || !this.stripeElements || !this.cardElement) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
    });

    if (error) {
      this.error = error.message || 'Payment failed';
      return;
    }

    // Create and confirm PaymentIntent (frontend-only TEST MODE)
    const paymentIntent = await this.confirmPayment(paymentMethod.id);

    if (paymentIntent.error) {
      this.error = paymentIntent.error.message;
    } else {
      this.success = true;
      this.paymentId = paymentIntent.id;

      return {
        success: true,
        paymentId: paymentIntent.id,
        message: 'Payment processed successfully'
      };
    }
  }

  // ⚠️ WARNING: This is UNSECURE for production!
  // Only works in test mode with test secret key exposed
  private async confirmPayment(paymentMethodId: string): Promise<any> {
    // Normally this should be a backend API call
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${environment.stripeSecretKey}` // ⚠️ Never do this in production
      },
      body: new URLSearchParams({
        amount: '1000', // $10.00 in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: 'true',
        return_url: window.location.href // For redirect flows
      })
    });

    return await response.json();
  }

  initializePayPal(buttonId: string, amount: number, onApprove: (data: any) => void): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          onApprove(details);
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
      }
    }).render(`#${buttonId}`);
  }

  async processPayPalPayment(amount: number): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: 'paypal_' + Math.random().toString(36).substring(2, 15),
          message: 'PayPal payment processed'
        });
      }, 1500);
    });
  }

  async processCreditCardPayment(cardDetails: any, amount: number, currency: string): Promise<any> {
    if (!this.validateCardDetails(cardDetails)) {
      return {
        success: false,
        message: 'Invalid card details'
      };
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      paymentId: 'cc_' + Math.random().toString(36).substring(2, 15),
      message: 'Payment processed (demo)'
    };
  }

  private validateCardDetails(cardDetails: any): boolean {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc) {
      return false;
    }

    return this.luhnCheck(cardDetails.cardNumber.replace(/\s/g, ''));
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    for (let i = 0; i < cardNumber.length; i++) {
      let digit = parseInt(cardNumber[i]);
      if ((cardNumber.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }
}
