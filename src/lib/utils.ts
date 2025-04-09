
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateWhatsAppLink(message: string): string {
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  // The phone number is 7995902773 as specified in requirements
  return `https://wa.me/917995902773?text=${encodedMessage}`;
}
