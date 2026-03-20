export type UserRole = 'customer' | 'driver' | 'warehouse_staff' | 'dispatcher' | 'agent' | 'admin' | 'super_admin';
export type AccountType = 'individual' | 'business' | 'corporate';
export type KYCStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  phone: string;
  phoneCountry: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  accountType: AccountType;
  businessName?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isKYCVerified: boolean;
  kycStatus: KYCStatus;
  countryOfResidence: string;
  preferredCurrency: 'USD' | 'NGN' | 'GHS' | 'KES';
  preferredLanguage: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  type: 'residential' | 'commercial' | 'warehouse' | 'port';
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
  isDefaultPickup: boolean;
  isDefaultDelivery: boolean;
}

export type ShipmentStatus = 
  | 'draft'
  | 'pending_pickup'
  | 'pickup_assigned'
  | 'picked_up'
  | 'at_warehouse'
  | 'processing'
  | 'customs_pending'
  | 'customs_cleared'
  | 'customs_held'
  | 'in_transit_domestic'
  | 'in_transit_international'
  | 'at_destination_warehouse'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned_to_sender'
  | 'cancelled'
  | 'on_hold';

export type ShipmentType = 'parcel' | 'cargo' | 'freight' | 'document' | 'fragile' | 'cold_chain';
export type ServiceType = 'standard' | 'express' | 'same_day' | 'economy' | 'air_freight' | 'sea_freight';
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';
export type PaymentMethod = 'wallet' | 'card' | 'bank_transfer' | 'cod' | 'corporate_credit';

export interface Shipment {
  id: string;
  trackingNumber: string;
  userId: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  shipmentType: ShipmentType;
  serviceType: ServiceType;
  status: ShipmentStatus;
  originCountry: string;
  destinationCountry: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  volumetricWeightKg?: number;
  chargeableWeightKg: number;
  declaredValue: number;
  currency: string;
  packageDescription: string;
  isInsured: boolean;
  insuranceCost: number;
  shippingCost: number;
  customsDuties: number;
  totalCost: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  pickupDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  labelUrl?: string;
  customsDocsStatus: 'not_required' | 'pending' | 'submitted' | 'cleared' | 'held';
  hsCode?: string;
  podPhotoUrl?: string;
  podSignatureUrl?: string;
  podDeliveredAt?: string;
  notes?: string;
  createdAt: string;
  trackingEvents: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  eventType: string;
  description: string;
  locationName: string;
  lat?: number;
  lng?: number;
  country?: string;
  occurredAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  currentVehicleId?: string;
  currentVehiclePlate?: string;
  vehicleType: string;
  currentLat?: number;
  currentLng?: number;
  lastLocationAt?: string;
  isOnline: boolean;
  isAvailable: boolean;
  status: 'offline' | 'available' | 'on_pickup' | 'on_delivery' | 'on_break';
  totalDeliveries: number;
  onTimeRate: number;
  rating: number;
  earningsBalance: number;
  branchId?: string;
  branchName?: string;
  currentLocation?: string;
  activeShipments: number;
  completedToday: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'motorcycle' | 'car' | 'van' | 'truck' | 'container_truck';
  make: string;
  model: string;
  year: number;
  capacityKg: number;
  capacityVolumeM3: number;
  country: string;
  branchId?: string;
  currentDriverId?: string;
  currentDriverName?: string;
  status: 'available' | 'on_trip' | 'maintenance' | 'inactive';
  lastLat?: number;
  lastLng?: number;
  lastGpsAt?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'origin' | 'destination' | 'transit' | 'fulfillment';
  country: string;
  address: Address;
  capacityM3: number;
  usedCapacityM3: number;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  operatingHours: Record<string, { open: string; close: string }>;
}

export interface Wallet {
  balanceUSD: number;
  balanceNGN: number;
  balanceGHS: number;
  balanceKES: number;
  isFrozen: boolean;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  category: 'topup' | 'shipment' | 'refund' | 'withdrawal' | 'driver_earning' | 'cod_credit' | 'adjustment';
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  shipmentId?: string;
  description: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  price: number;
  currency: string;
  estimatedDays: { min: number; max: number };
  includesCustoms: boolean;
  aiRecommended: boolean;
  confidenceScore: number;
  breakdown: {
    base: number;
    fuel: number;
    customsEstimate: number;
    insurance: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels: ('push' | 'sms' | 'email')[];
  isRead: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  type: 'hq' | 'branch' | 'agent' | 'partner';
  country: string;
  address: Address;
  managerId?: string;
  managerName?: string;
  phone: string;
  email: string;
  isActive: boolean;
  commissionRate?: number;
  parentBranchId?: string;
  shipmentCount: number;
  revenue: number;
}

export interface CustomsDocument {
  id: string;
  shipmentId: string;
  documentType: 'commercial_invoice' | 'packing_list' | 'bill_of_lading' | 'airway_bill' | 'certificate_of_origin' | 'import_permit' | 'export_permit' | 'other';
  fileUrl: string;
  fileName: string;
  aiExtractedData?: Record<string, unknown>;
  aiConfidenceScore?: number;
  status: 'uploaded' | 'reviewed' | 'approved' | 'rejected' | 'expired';
  expiryDate?: string;
  createdAt: string;
}

export interface KPIData {
  totalShipments: number;
  activeToday: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  revenue: string;
  revenueChange: string;
  onTimeRate: number;
  avgDeliveryTime: string;
  activeDrivers: number;
  totalDrivers: number;
  fleetUtilization: number;
  pendingPayments: string;
  customsHolds: number;
}

export interface ActivityItem {
  id: string;
  type: 'shipment' | 'driver' | 'alert' | 'payment' | 'system';
  message: string;
  time: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}
