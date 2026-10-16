import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: 'AZN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('AZN', '₼');
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('az-AZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateOrderNumber(): string {
  const prefix = "SB";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${random}`;
}

export function generateTicketNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `TCK-${random}`;
}
