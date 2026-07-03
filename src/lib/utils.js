import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top;

export function getLimit(user, type) {
  const plan = user?.plan || user?.subscription?.plan || 'free';
  const role = user?.role || user?.rol || 'user';
  
  if (user?.email?.toLowerCase() === 'nachotechrd@gmail.com' || role === 'admin') {
    return Infinity;
  }

  if (type === 'products') {
    if (plan === 'free') return 30;
    if (plan === 'basic') return 200;
    return Infinity;
  }
  
  if (type === 'clients') {
    if (plan === 'free') return 20;
    if (plan === 'basic') return 500;
    return Infinity;
  }
  
  if (type === 'invoices') {
    if (plan === 'free') return 50;
    return Infinity;
  }
  
  return Infinity;
}
