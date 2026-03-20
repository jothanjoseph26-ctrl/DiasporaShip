import type { ShipmentStatus } from '@/types';

const statusConfig: Record<ShipmentStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-700' },
  pending_pickup: { label: 'Pending Pickup', bg: 'bg-amber-100', text: 'text-amber-800' },
  pickup_assigned: { label: 'Pickup Assigned', bg: 'bg-blue-100', text: 'text-blue-800' },
  picked_up: { label: 'Picked Up', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  at_warehouse: { label: 'At Warehouse', bg: 'bg-violet-100', text: 'text-violet-800' },
  processing: { label: 'Processing', bg: 'bg-cyan-100', text: 'text-cyan-800' },
  customs_pending: { label: 'Customs Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
  customs_cleared: { label: 'Customs Cleared', bg: 'bg-green-100', text: 'text-green-800' },
  customs_held: { label: 'Customs Held', bg: 'bg-red-100', text: 'text-red-800' },
  in_transit_domestic: { label: 'In Transit', bg: 'bg-blue-100', text: 'text-blue-800' },
  in_transit_international: { label: 'In Transit', bg: 'bg-blue-100', text: 'text-blue-800' },
  at_destination_warehouse: { label: 'At Destination', bg: 'bg-violet-100', text: 'text-violet-800' },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-800' },
  failed_delivery: { label: 'Failed Delivery', bg: 'bg-red-100', text: 'text-red-800' },
  returned_to_sender: { label: 'Returned', bg: 'bg-orange-100', text: 'text-orange-800' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-700' },
  on_hold: { label: 'On Hold', bg: 'bg-amber-100', text: 'text-amber-800' },
};

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  );
}
