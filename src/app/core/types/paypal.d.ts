declare namespace paypal {
  interface ButtonsOptions {
    style?: {
      layout?: 'vertical' | 'horizontal';
      color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
      shape?: 'rect' | 'pill';
      label?: 'paypal' | 'checkout' | 'buynow' | 'pay';
    };
    createOrder: (data: any, actions: any) => Promise<string>;
    onApprove: (data: any, actions: any) => Promise<void>;
    onError?: (err: any) => void;
  }

  interface Buttons {
    (options: ButtonsOptions): {
      render: (selector: string) => void;
    };
  }
}

declare var paypal: {
  Buttons: paypal.Buttons;
};