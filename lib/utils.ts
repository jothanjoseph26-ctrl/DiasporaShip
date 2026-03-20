import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', options ? {
    ...options,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  } : {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
}

export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DS-${year}${month}${day}-${random}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-muted-foreground',
    pending_pickup: 'bg-yellow-500',
    pickup_assigned: 'bg-blue-500',
    picked_up: 'bg-blue-500',
    at_warehouse: 'bg-purple-500',
    processing: 'bg-purple-500',
    customs_pending: 'bg-orange-500',
    customs_cleared: 'bg-green-500',
    customs_held: 'bg-red-500',
    in_transit_domestic: 'bg-blue-500',
    in_transit_international: 'bg-blue-500',
    at_destination_warehouse: 'bg-purple-500',
    out_for_delivery: 'bg-green-500',
    delivered: 'bg-green-500',
    failed_delivery: 'bg-red-500',
    returned_to_sender: 'bg-gray-500',
    cancelled: 'bg-gray-500',
    on_hold: 'bg-red-500',
  };
  return colors[status] || 'bg-muted-foreground';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending_pickup: 'Pending Pickup',
    pickup_assigned: 'Pickup Assigned',
    picked_up: 'Picked Up',
    at_warehouse: 'At Warehouse',
    processing: 'Processing',
    customs_pending: 'Customs Pending',
    customs_cleared: 'Customs Cleared',
    customs_held: 'Customs Hold',
    in_transit_domestic: 'In Transit (Domestic)',
    in_transit_international: 'In Transit (International)',
    at_destination_warehouse: 'At Destination Warehouse',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    failed_delivery: 'Failed Delivery',
    returned_to_sender: 'Returned',
    cancelled: 'Cancelled',
    on_hold: 'On Hold',
  };
  return labels[status] || status;
}

export function getDriverStatusColor(status: string): string {
  const colors: Record<string, string> = {
    offline: 'bg-gray-400',
    available: 'bg-green-500',
    on_pickup: 'bg-blue-500',
    on_delivery: 'bg-blue-500',
    on_break: 'bg-yellow-500',
  };
  return colors[status] || 'bg-gray-400';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };
  return colors[severity] || 'bg-gray-500';
}
