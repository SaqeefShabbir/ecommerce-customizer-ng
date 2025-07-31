import { PaymentMethod } from "../enums/payment-method.enum";
import { Product } from "./product";

export interface Order {
  id: string;
  items: Product[];
  total: number;
  paymentMethod: PaymentMethod | null;
  paymentId: string | undefined;
  date: Date;
  status?: 'pending' | 'completed' | 'failed';
}