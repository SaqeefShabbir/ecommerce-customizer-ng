import { PayPalButtons } from '@paypal/paypal-js';

declare global {
  interface Window {
    paypal?: {
      Buttons: typeof PayPalButtons;
    };
  }
}