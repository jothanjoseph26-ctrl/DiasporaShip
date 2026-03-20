'use client';

import { useState, useMemo } from 'react';
import { Download, Edit, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, FilterBar, StatusBadge, RightDrawer, TrackingTimeline } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { Shipment, ShipmentStatus } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const ALL_STATUSES: ShipmentStatus[] = [
  'draft','pending_pickup','pickup_assigned','picked_up','at_warehouse',
  'processing','customs_pending','customs_cleared','customs_held',
  'in_transit_domestic','in_transit_international','at_destination_warehouse',
  'out_for_delivery','delivered','failed_delivery','returned_to_sender','cancelled','on_hold',
];

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  draft:'Draft',pending_pickup:'Pending Pickup',pickup_assigned:'Pickup Assigned',
  picked_up:'Picked Up',at_warehouse:'At Warehouse',processing:'Processing',
  customs_pending:'Customs Pending',customs_cleared:'Customs Cleared',customs_held:'Customs Held',
  in_transit_domestic:'In Transit Domestic',in_transit_international:'In Transit Intl',
  at_destination_warehouse:'At Destination',out_for_delivery:'Out for Delivery',
  delivered:'Delivered',failed_delivery:'Failed Delivery',returned_to_sender:'Returned',
  cancelled:'Cancelled',on_hold:'On Hold',
};

const COURIERS = ['DHL','FedEx','UPS','Aramex','Local Fleet','Adebayo Ogundimu','Chinwe Eze','Emeka Nwosu'];
const BRANCHES = ['Lagos HQ','Abuja Branch','Kano Branch','Port Harcourt Branch','Atlanta HQ','Accra Agent'];
const FLAG: Record<string,string> = { US:'🇺🇸', NG:'🇳🇬', GH:'🇬🇭', KE:'🇰🇪', GB:'🇬🇧', CN:'🇨🇳' };

const mockShipments: Shipment[] = [
  { id:'s1',trackingNumber:'DS-20260318-A1B2C3',userId:'u1',assignedDriverName:'Adebayo Ogundimu',shipmentType:'parcel',serviceType:'express',status:'in_transit_international',originCountry:'US',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:12.5,chargeableWeightKg:12.5,declaredValue:850,currency:'USD',packageDescription:'Electronics',isInsured:true,insuranceCost:12.75,shippingCost:145,customsDuties:85,totalCost:242.75,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-15',estimatedDeliveryDate:'2026-03-25',customsDocsStatus:'submitted',hsCode:'8473.30',createdAt:'2026-03-15T10:30:00Z',trackingEvents:[{id:'e1',shipmentId:'s1',eventType:'booked',description:'Shipment booked',locationName:'Atlanta, GA',country:'US',occurredAt:'2026-03-15T10:30:00Z'},{id:'e2',shipmentId:'s1',eventType:'in_transit_international',description:'Departed via DHL Air',locationName:'Hartsfield-Jackson Airport',country:'US',occurredAt:'2026-03-17T08:00:00Z'}]},
  { id:'s2',trackingNumber:'DS-20260316-D4E5F6',userId:'u2',assignedDriverName:'Emeka Nwosu',shipmentType:'parcel',serviceType:'standard',status:'out_for_delivery',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:5.2,chargeableWeightKg:5.2,declaredValue:150,currency:'NGN',packageDescription:'Clothing',isInsured:false,insuranceCost:0,shippingCost:12500,customsDuties:0,totalCost:12500,paymentStatus:'paid',paymentMethod:'wallet',pickupDate:'2026-03-14',estimatedDeliveryDate:'2026-03-18',customsDocsStatus:'not_required',createdAt:'2026-03-14T08:00:00Z',trackingEvents:[]},
  { id:'s3',trackingNumber:'DS-20260312-G7H8I9',userId:'u3',shipmentType:'cargo',serviceType:'sea_freight',status:'customs_pending',originCountry:'CN',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:1250,chargeableWeightKg:1250,declaredValue:15000,currency:'USD',packageDescription:'Industrial machinery',isInsured:true,insuranceCost:225,shippingCost:2800,customsDuties:4500,totalCost:7525,paymentStatus:'paid',paymentMethod:'corporate_credit',pickupDate:'2026-03-01',estimatedDeliveryDate:'2026-04-05',customsDocsStatus:'pending',hsCode:'8481.80',createdAt:'2026-03-01T06:00:00Z',trackingEvents:[]},
  { id:'s4',trackingNumber:'DS-20260317-J0K1L2',userId:'u1',assignedDriverName:'Adebayo Ogundimu',shipmentType:'document',serviceType:'express',status:'delivered',originCountry:'UK',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:0.5,chargeableWeightKg:0.5,declaredValue:50,currency:'USD',packageDescription:'Legal documents',isInsured:false,insuranceCost:0,shippingCost:85,customsDuties:0,totalCost:85,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-15',estimatedDeliveryDate:'2026-03-17',actualDeliveryDate:'2026-03-17T14:30:00Z',customsDocsStatus:'not_required',createdAt:'2026-03-15T12:00:00Z',trackingEvents:[]},
  { id:'s5',trackingNumber:'DS-20260315-M3N4O5',userId:'u4',assignedDriverName:'Chinwe Eze',shipmentType:'parcel',serviceType:'same_day',status:'picked_up',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:3,chargeableWeightKg:3,declaredValue:200,currency:'NGN',packageDescription:'Food items',isInsured:false,insuranceCost:0,shippingCost:5000,customsDuties:0,totalCost:5000,paymentStatus:'paid',paymentMethod:'wallet',pickupDate:'2026-03-18',estimatedDeliveryDate:'2026-03-18',customsDocsStatus:'not_required',createdAt:'2026-03-18T07:00:00Z',trackingEvents:[]},
  { id:'s6',trackingNumber:'DS-20260314-P6Q7R8',userId:'u5',shipmentType:'fragile',serviceType:'express',status:'customs_held',originCountry:'US',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:8,chargeableWeightKg:8,declaredValue:1200,currency:'USD',packageDescription:'Glass artwork',isInsured:true,insuranceCost:18,shippingCost:195,customsDuties:320,totalCost:533,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-12',estimatedDeliveryDate:'2026-03-20',customsDocsStatus:'held',createdAt:'2026-03-12T09:00:00Z',trackingEvents:[]},
  { id:'s7',trackingNumber:'DS-20260313-S9T0U1',userId:'u6',assignedDriverName:'Ibrahim Musa',shipmentType:'parcel',serviceType:'standard',status:'in_transit_domestic',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:15,chargeableWeightKg:15,declaredValue:400,currency:'NGN',packageDescription:'Auto parts',isInsured:false,insuranceCost:0,shippingCost:18000,customsDuties:0,totalCost:18000,paymentStatus:'pending',paymentMethod:'cod',pickupDate:'2026-03-16',estimatedDeliveryDate:'2026-03-20',customsDocsStatus:'not_required',createdAt:'2026-03-13T11:00:00Z',trackingEvents:[]},
  { id:'s8',trackingNumber:'DS-20260311-V2W3X4',userId:'u2',shipmentType:'cold_chain',serviceType:'air_freight',status:'at_warehouse',originCountry:'US',destinationCountry:'KE',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:25,chargeableWeightKg:25,declaredValue:3000,currency:'USD',packageDescription:'Pharmaceutical supplies',isInsured:true,insuranceCost:45,shippingCost:380,customsDuties:0,totalCost:425,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-10',estimatedDeliveryDate:'2026-03-19',customsDocsStatus:'submitted',createdAt:'2026-03-10T14:00:00Z',trackingEvents:[]},
  { id:'s9',trackingNumber:'DS-20260310-Y5Z6A7',userId:'u7',assignedDriverName:'Fatima Bello',shipmentType:'parcel',serviceType:'economy',status:'pending_pickup',originCountry:'NG',destinationCountry:'GH',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:4,chargeableWeightKg:4,declaredValue:120,currency:'NGN',packageDescription:'Books and stationery',isInsured:false,insuranceCost:0,shippingCost:8500,customsDuties:0,totalCost:8500,paymentStatus:'pending',paymentMethod:'wallet',pickupDate:'2026-03-19',estimatedDeliveryDate:'2026-03-28',customsDocsStatus:'not_required',createdAt:'2026-03-10T16:00:00Z',trackingEvents:[]},
  { id:'s10',trackingNumber:'DS-20260309-B8C9D0',userId:'u3',shipmentType:'freight',serviceType:'sea_freight',status:'processing',originCountry:'US',destinationCountry:'GH',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:2500,chargeableWeightKg:2500,declaredValue:28000,currency:'USD',packageDescription:'Construction materials',isInsured:true,insuranceCost:420,shippingCost:4500,customsDuties:3200,totalCost:8120,paymentStatus:'partial',paymentMethod:'bank_transfer',pickupDate:'2026-03-05',estimatedDeliveryDate:'2026-04-10',customsDocsStatus:'pending',createdAt:'2026-03-09T08:00:00Z',trackingEvents:[]},
  { id:'s11',trackingNumber:'DS-20260308-E1F2G3',userId:'u8',assignedDriverName:'Grace Okafor',shipmentType:'parcel',serviceType:'express',status:'pickup_assigned',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:2,chargeableWeightKg:2,declaredValue:75,currency:'NGN',packageDescription:'Accessories',isInsured:false,insuranceCost:0,shippingCost:4000,customsDuties:0,totalCost:4000,paymentStatus:'paid',paymentMethod:'wallet',pickupDate:'2026-03-18',estimatedDeliveryDate:'2026-03-19',customsDocsStatus:'not_required',createdAt:'2026-03-08T10:00:00Z',trackingEvents:[]},
  { id:'s12',trackingNumber:'DS-20260307-H4I5J6',userId:'u5',shipmentType:'cargo',serviceType:'air_freight',status:'at_destination_warehouse',originCountry:'US',destinationCountry:'KE',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:180,chargeableWeightKg:180,declaredValue:5500,currency:'USD',packageDescription:'Electronics batch',isInsured:true,insuranceCost:82.5,shippingCost:720,customsDuties:650,totalCost:1452.5,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-06',estimatedDeliveryDate:'2026-03-14',customsDocsStatus:'cleared',createdAt:'2026-03-07T07:00:00Z',trackingEvents:[]},
  { id:'s13',trackingNumber:'DS-20260306-K7L8M9',userId:'u9',shipmentType:'parcel',serviceType:'standard',status:'returned_to_sender',originCountry:'GB',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:1.5,chargeableWeightKg:1.5,declaredValue:200,currency:'GBP',packageDescription:'Clothing items',isInsured:false,insuranceCost:0,shippingCost:45,customsDuties:0,totalCost:45,paymentStatus:'refunded',paymentMethod:'card',pickupDate:'2026-03-01',estimatedDeliveryDate:'2026-03-08',customsDocsStatus:'not_required',createdAt:'2026-03-06T13:00:00Z',trackingEvents:[]},
  { id:'s14',trackingNumber:'DS-20260305-N0O1P2',userId:'u4',assignedDriverName:'Adebayo Ogundimu',shipmentType:'document',serviceType:'express',status:'draft',originCountry:'NG',destinationCountry:'US',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:0.3,chargeableWeightKg:0.3,declaredValue:10,currency:'USD',packageDescription:'Passport documents',isInsured:false,insuranceCost:0,shippingCost:0,customsDuties:0,totalCost:0,paymentStatus:'pending',paymentMethod:'wallet',pickupDate:'2026-03-19',estimatedDeliveryDate:'2026-03-26',customsDocsStatus:'not_required',createdAt:'2026-03-05T15:00:00Z',trackingEvents:[]},
  { id:'s15',trackingNumber:'DS-20260304-Q3R4S5',userId:'u6',shipmentType:'parcel',serviceType:'same_day',status:'failed_delivery',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:1,chargeableWeightKg:1,declaredValue:50,currency:'NGN',packageDescription:'Documents',isInsured:false,insuranceCost:0,shippingCost:3500,customsDuties:0,totalCost:3500,paymentStatus:'paid',paymentMethod:'wallet',pickupDate:'2026-03-04',estimatedDeliveryDate:'2026-03-04',customsDocsStatus:'not_required',createdAt:'2026-03-04T09:00:00Z',trackingEvents:[]},
  { id:'s16',trackingNumber:'DS-20260303-T6U7V8',userId:'u10',shipmentType:'freight',serviceType:'sea_freight',status:'in_transit_international',originCountry:'CN',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:5000,chargeableWeightKg:5000,declaredValue:42000,currency:'USD',packageDescription:'Textile machinery',isInsured:true,insuranceCost:630,shippingCost:8500,customsDuties:6300,totalCost:15430,paymentStatus:'paid',paymentMethod:'bank_transfer',pickupDate:'2026-02-25',estimatedDeliveryDate:'2026-03-30',customsDocsStatus:'submitted',createdAt:'2026-03-03T06:00:00Z',trackingEvents:[]},
  { id:'s17',trackingNumber:'DS-20260302-W9X0Y1',userId:'u7',assignedDriverName:'Chinwe Eze',shipmentType:'parcel',serviceType:'express',status:'on_hold',originCountry:'US',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:6,chargeableWeightKg:6,declaredValue:950,currency:'USD',packageDescription:'Designer accessories',isInsured:true,insuranceCost:14.25,shippingCost:165,customsDuties:142,totalCost:321.25,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-03-01',estimatedDeliveryDate:'2026-03-10',customsDocsStatus:'pending',createdAt:'2026-03-02T11:00:00Z',trackingEvents:[]},
  { id:'s18',trackingNumber:'DS-20260301-Z2A3B4',userId:'u8',shipmentType:'fragile',serviceType:'air_freight',status:'cancelled',originCountry:'GB',destinationCountry:'KE',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:10,chargeableWeightKg:10,declaredValue:2000,currency:'GBP',packageDescription:'Ceramic vases',isInsured:true,insuranceCost:30,shippingCost:280,customsDuties:0,totalCost:310,paymentStatus:'refunded',paymentMethod:'card',pickupDate:'2026-03-02',estimatedDeliveryDate:'2026-03-08',customsDocsStatus:'not_required',createdAt:'2026-03-01T14:00:00Z',trackingEvents:[]},
  { id:'s19',trackingNumber:'DS-20260228-C5D6E7',userId:'u11',assignedDriverName:'Emeka Nwosu',shipmentType:'parcel',serviceType:'standard',status:'delivered',originCountry:'NG',destinationCountry:'NG',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:7,chargeableWeightKg:7,declaredValue:300,currency:'NGN',packageDescription:'Household items',isInsured:false,insuranceCost:0,shippingCost:9500,customsDuties:0,totalCost:9500,paymentStatus:'paid',paymentMethod:'cod',pickupDate:'2026-02-26',estimatedDeliveryDate:'2026-03-01',actualDeliveryDate:'2026-03-01T16:00:00Z',customsDocsStatus:'not_required',createdAt:'2026-02-28T08:00:00Z',trackingEvents:[]},
  { id:'s20',trackingNumber:'DS-20260227-F8G9H0',userId:'u3',shipmentType:'cargo',serviceType:'air_freight',status:'customs_cleared',originCountry:'US',destinationCountry:'GH',pickupAddress:{} as any,deliveryAddress:{} as any,weightKg:95,chargeableWeightKg:95,declaredValue:7200,currency:'USD',packageDescription:'Medical equipment',isInsured:true,insuranceCost:108,shippingCost:1450,customsDuties:720,totalCost:2278,paymentStatus:'paid',paymentMethod:'card',pickupDate:'2026-02-20',estimatedDeliveryDate:'2026-03-05',customsDocsStatus:'cleared',createdAt:'2026-02-27T10:00:00Z',trackingEvents:[]},
];

const filterConfigs: FilterConfig[] = [
  { key:'status', type:'select', label:'Status', options: ALL_STATUSES.map(s => ({ value:s, label:STATUS_LABELS[s] })) },
  { key:'courier', type:'select', label:'Courier', options: COURIERS.map(c => ({ value:c, label:c })) },
  { key:'branch', type:'select', label:'Branch', options: BRANCHES.map(b => ({ value:b, label:b })) },
  { key:'dateFrom', type:'dateRange', label:'From' },
  { key:'dateTo', type:'dateRange', label:'To' },
  { key:'search', type:'search', label:'Search', placeholder:'Tracking ID or customer...' },
];

const TYPE_COLORS: Record<string,string> = {
  parcel:'bg-blue-100 text-blue-800',cargo:'bg-amber-100 text-amber-800',freight:'bg-violet-100 text-violet-800',
  document:'bg-gray-100 text-gray-800',fragile:'bg-red-100 text-red-800',cold_chain:'bg-cyan-100 text-cyan-800',
};
const SERVICE_LABELS: Record<string,string> = {
  standard:'Standard',express:'Express',same_day:'Same Day',economy:'Economy',air_freight:'Air',sea_freight:'Sea',
};

const customers: Record<string,string> = {
  u1:'John Okafor',u2:'Amina Sani',u3:'TechCorp Ltd',u4:'Grace Nwosu',u5:'Kwame Asante',
  u6:'Emeka Nwankwo',u7:'Fatima Bello',u8:'Michael Chen',u9:'Wanjiku Kamau',u10:'Smith & Associates',u11:'Okafor Trading',
};

export default function AdminShipmentsPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<ShipmentStatus>('processing');
  const [drawerStatus, setDrawerStatus] = useState<ShipmentStatus>('processing');

  const filtered = useMemo(() => {
    return mockShipments.filter(s => {
      if (filters.status && s.status !== filters.status) return false;
      if (filters.courier && s.assignedDriverName !== filters.courier && !s.trackingNumber.includes(filters.courier)) return false;
      if (filters.branch) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.trackingNumber.toLowerCase().includes(q) && !(customers[s.userId] || '').toLowerCase().includes(q)) return false;
      }
      if (filters.dateFrom && s.pickupDate < filters.dateFrom) return false;
      if (filters.dateTo && s.pickupDate > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => setFilters(f => ({ ...f, [key]: value }));
  const handleClear = () => setFilters({});

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const columns = [
    {
      key:'select', label:'',
      render: (s: Shipment) => (
        <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)} onClick={e => e.stopPropagation()} className="w-4 h-4 rounded border-[var(--border-warm)] accent-[var(--terra)]" />
      ),
    },
    {
      key:'trackingNumber', label:'Tracking ID', sortable:true,
      render: (s: Shipment) => <span className="font-mono text-xs">{s.trackingNumber}</span>,
    },
    {
      key:'customer', label:'Customer',
      render: (s: Shipment) => <span className="text-sm">{customers[s.userId] || 'Unknown'}</span>,
    },
    {
      key:'shipmentType', label:'Type',
      render: (s: Shipment) => <Badge className={TYPE_COLORS[s.shipmentType] || 'bg-gray-100 text-gray-800'}>{s.shipmentType}</Badge>,
    },
    {
      key:'route', label:'Route',
      render: (s: Shipment) => <span className="text-sm">{FLAG[s.originCountry] || s.originCountry} → {FLAG[s.destinationCountry] || s.destinationCountry}</span>,
    },
    {
      key:'serviceType', label:'Service',
      render: (s: Shipment) => <span className="text-sm">{SERVICE_LABELS[s.serviceType] || s.serviceType}</span>,
    },
    {
      key:'status', label:'Status', sortable:true,
      render: (s: Shipment) => <StatusBadge status={s.status} />,
    },
    {
      key:'courier', label:'Courier',
      render: (s: Shipment) => <span className="text-sm">{s.assignedDriverName || '—'}</span>,
    },
    {
      key:'branch', label:'Branch',
      render: () => <span className="text-sm">{BRANCHES[Math.floor(Math.random()*BRANCHES.length)]}</span>,
    },
    {
      key:'totalCost', label:'Amount', sortable:true,
      render: (s: Shipment) => <span className="text-sm font-medium">{formatCurrency(s.totalCost, s.currency)}</span>,
    },
    {
      key:'createdAt', label:'Date', sortable:true,
      render: (s: Shipment) => <span className="text-xs text-[var(--muted-text)]">{formatDate(s.createdAt)}</span>,
    },
    {
      key:'actions', label:'Actions',
      render: (s: Shipment) => (
        <div className="flex gap-1">
          <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => { e.stopPropagation(); setSelectedShipment(s); setDrawerStatus(s.status); setDrawerOpen(true); }}>
            <Eye size={14} />
          </button>
          <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => e.stopPropagation()}>
            <Edit size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--ink)]">Shipments</h1>
          <p className="text-xs text-[var(--muted-text)]">{filtered.length} shipments found</p>
        </div>
        <Button variant="outline" className="gap-2 text-sm">
          <Download size={14} />
          Export CSV
        </Button>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={handleFilterChange} onClear={handleClear} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(s: any) => { setSelectedShipment(s); setDrawerStatus(s.status); setDrawerOpen(true); }} pageSize={10} />

      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--ink)] text-white px-6 py-3 flex items-center justify-between shadow-lg">
          <span className="text-sm font-medium">{selectedIds.size} shipment{selectedIds.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-3">
            <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as ShipmentStatus)}>
              <SelectTrigger className="h-8 w-48 bg-white/10 border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-8">
              Update Status
            </Button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-white/60 hover:text-white">Clear</button>
          </div>
        </div>
      )}

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Shipment Details" width={480}>
        {selectedShipment && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold">{selectedShipment.trackingNumber}</span>
                <StatusBadge status={selectedShipment.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[var(--muted-text)] text-xs">Customer</span><div className="font-medium">{customers[selectedShipment.userId] || 'Unknown'}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Route</span><div>{FLAG[selectedShipment.originCountry]} → {FLAG[selectedShipment.destinationCountry]}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Type</span><div className="capitalize">{selectedShipment.shipmentType}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Service</span><div>{SERVICE_LABELS[selectedShipment.serviceType]}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Weight</span><div>{selectedShipment.weightKg} kg</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Amount</span><div className="font-medium">{formatCurrency(selectedShipment.totalCost, selectedShipment.currency)}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Courier</span><div>{selectedShipment.assignedDriverName || '—'}</div></div>
                <div><span className="text-[var(--muted-text)] text-xs">Payment</span><div className="capitalize">{selectedShipment.paymentStatus}</div></div>
              </div>
              {selectedShipment.hsCode && (
                <div className="text-sm"><span className="text-[var(--muted-text)] text-xs">HS Code</span><div className="font-mono">{selectedShipment.hsCode}</div></div>
              )}
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-[var(--ink)]">Update Status</h3>
              <Select value={drawerStatus} onValueChange={(v) => setDrawerStatus(v as ShipmentStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">Save</Button>
            </div>

            {selectedShipment.trackingEvents.length > 0 && (
              <div className="border-t border-[var(--border-warm)] pt-4">
                <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Timeline</h3>
                <TrackingTimeline events={selectedShipment.trackingEvents} />
              </div>
            )}
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
