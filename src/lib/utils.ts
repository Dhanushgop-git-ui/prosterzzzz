
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
  // Updated phone number as requested
  return `https://wa.me/919502869924?text=${encodedMessage}`;
}
