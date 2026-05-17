// src/services/paymentService.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  orderId: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientEmail: string;
  formulaName: string;
  roomType: string;
  decoStyle: string;
  photoCount: number;
  multiVue: boolean;
  priceHT: number;
  tva: number;
  priceTTC: number;
  pdfUrl: string;
}

// ─── Create PaymentIntent via backend ───────────────────────────────────────────
export async function createPaymentIntent(
  formulaId: string,
  amount: number,
  metadata: Record<string, string>,
): Promise<PaymentIntentResult> {
  const response = await axios.post(`${API_BASE_URL}/payments/create-intent`, {
    formulaId,
    amount: Math.round(amount * 100), // centimes
    currency: 'eur',
    metadata,
  });
  return response.data;
}

// ─── Confirm payment and fetch invoice ──────────────────────────────────────────
export async function confirmPaymentAndGetInvoice(
  orderId: string,
  paymentIntentId: string,
): Promise<InvoiceData> {
  const response = await axios.post(`${API_BASE_URL}/payments/confirm`, {
    orderId,
    paymentIntentId,
  });
  return response.data.invoice;
}

// ─── Fetch order status ──────────────────────────────────────────────────────────
export async function fetchOrderStatus(orderId: string) {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
}

// ─── Get invoice PDF URL ─────────────────────────────────────────────────────────
export async function getInvoicePdf(invoiceId: string): Promise<string> {
  const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceId}/pdf`);
  return response.data.url;
}
