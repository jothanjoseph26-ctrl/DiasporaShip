import { create } from 'zustand';
import type { User, Shipment, Driver, Vehicle, Wallet, Transaction, Quote, Notification, Branch, KPIData, ActivityItem, Warehouse } from '@/types';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AppState>((set) => ({
  currentUser: {
    id: 'u1',
    email: 'john.okafor@example.com',
    phone: '+2348012345678',
    phoneCountry: 'NG',
    firstName: 'John',
    lastName: 'Okafor',
    role: 'customer',
    accountType: 'business',
    businessName: 'Okafor Trading Co.',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    isKYCVerified: true,
    kycStatus: 'approved',
    countryOfResidence: 'US',
    preferredCurrency: 'USD',
    preferredLanguage: 'en',
    avatarUrl: undefined,
    createdAt: '2024-01-15T00:00:00Z',
  },
  isAuthenticated: true,
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  login: async (email, _password) => {
    void _password;
    set({ currentUser: {
      id: 'u1',
      email,
      phone: '+2348012345678',
      phoneCountry: 'NG',
      firstName: 'John',
      lastName: 'Okafor',
      role: 'customer',
      accountType: 'business',
      businessName: 'Okafor Trading Co.',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      isKYCVerified: true,
      kycStatus: 'approved',
      countryOfResidence: 'US',
      preferredCurrency: 'USD',
      preferredLanguage: 'en',
      createdAt: '2024-01-15T00:00:00Z',
    }, isAuthenticated: true });
    return true;
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));

interface ShipmentState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  getShipmentById: (id: string) => Shipment | undefined;
  getShipmentByTracking: (tracking: string) => Shipment | undefined;
}

const mockShipments: Shipment[] = [
  {
    id: 's1',
    trackingNumber: 'DS-20260318-A1B2C3',
    userId: 'u1',
    assignedDriverId: 'd1',
    assignedDriverName: 'Adebayo Ogundimu',
    responsibleTeam: 'Customer care + origin warehouse + customs',
    corridor: 'US -> NG',
    routeLabel: 'US pickup -> international transit -> customs clearance -> Nigeria last-mile',
    shipmentType: 'parcel',
    serviceType: 'express',
    status: 'delivered',
    originCountry: 'US',
    destinationCountry: 'NG',
    pickupAddress: {
      id: 'a1',
      label: 'Warehouse',
      type: 'warehouse',
      recipientName: 'John Okafor',
      recipientPhone: '+12345551234',
      addressLine1: '123 Commerce St',
      addressLine2: 'Suite 400',
      city: 'Atlanta',
      stateProvince: 'GA',
      postalCode: '30301',
      country: 'US',
      isDefaultPickup: true,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'a2',
      label: 'Office',
      type: 'commercial',
      recipientName: 'Emmanuel Okafor',
      recipientPhone: '+2348012345678',
      addressLine1: '15 Admiralty Way',
      addressLine2: 'Lekki Phase 1',
      city: 'Lagos',
      stateProvince: 'Lagos',
      postalCode: '10176',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 12.5,
    lengthCm: 45,
    widthCm: 30,
    heightCm: 25,
    volumetricWeightKg: 6.75,
    chargeableWeightKg: 12.5,
    declaredValue: 850,
    currency: 'USD',
    packageDescription: 'Electronics - Laptop accessories and phone parts',
    isInsured: true,
    insuranceCost: 12.75,
    shippingCost: 145.00,
    customsDuties: 85.00,
    totalCost: 242.75,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    pickupDate: '2026-03-15',
    estimatedDeliveryDate: '2026-03-25',
    customsDocsStatus: 'submitted',
    requiresCustoms: true,
    customsReference: 'CUS-ATL-440182',
    hsCode: '8473.30',
    customsOfficer: 'A. Musa',
    etaConfidence: 92,
    deliveryAttempts: 1,
    podRecipientName: 'Emmanuel Okafor',
    podLocationName: 'Lekki Phase 1, Lagos',
    proofOfDeliveryMethod: 'signature',
    proofOfDeliveryLocation: 'Lekki Phase 1, Lagos',
    podDeliveredAt: '2026-03-25T15:10:00Z',
    podPhotoUrl: '/images/cell-4-lagos-delivered.jpg',
    podSignatureUrl: '/images/cell-4-lagos-delivered.jpg',
    complianceFlags: ['KYC verified', 'Insurance selected', 'Duties estimated', 'POD captured'],
    handoffNotes: 'Origin warehouse -> air line haul -> Apapa customs -> Lagos destination warehouse -> driver handoff',
    documentChecklist: ['Commercial invoice', 'Packing list', 'KYC verification', 'Insurance proof', 'Customs import docs'],
    createdAt: '2026-03-15T10:30:00Z',
    trackingEvents: [
      { id: 'e1', shipmentId: 's1', eventType: 'booked', description: 'Shipment booked and payment confirmed', locationName: 'Atlanta, GA', country: 'US', team: 'Customer care', occurredAt: '2026-03-15T10:30:00Z' },
      { id: 'e2', shipmentId: 's1', eventType: 'pickup_assigned', description: 'Driver Adebayo Ogundimu assigned for pickup', locationName: 'Atlanta, GA', country: 'US', team: 'Dispatch', occurredAt: '2026-03-15T11:00:00Z' },
      { id: 'e3', shipmentId: 's1', eventType: 'picked_up', description: 'Package collected from sender', locationName: 'Atlanta, GA', country: 'US', team: 'Origin warehouse', occurredAt: '2026-03-15T14:30:00Z' },
      { id: 'e4', shipmentId: 's1', eventType: 'at_warehouse', description: 'Package received at Atlanta Hub', locationName: 'Atlanta Hub', country: 'US', team: 'Origin warehouse', occurredAt: '2026-03-15T18:00:00Z' },
      { id: 'e5', shipmentId: 's1', eventType: 'processing', description: 'Docs checked: invoice, packing list, KYC verified', locationName: 'Atlanta Hub', country: 'US', team: 'Customs desk', occurredAt: '2026-03-16T09:00:00Z' },
      { id: 'e6', shipmentId: 's1', eventType: 'customs_cleared', description: 'Export clearance completed and airway bill released', locationName: 'Atlanta Hub', country: 'US', team: 'Customs desk', occurredAt: '2026-03-16T15:00:00Z' },
      { id: 'e7', shipmentId: 's1', eventType: 'in_transit_international', description: 'Departed via DHL Air Freight', locationName: 'Hartsfield-Jackson Airport', country: 'US', team: 'Line haul', occurredAt: '2026-03-17T08:00:00Z' },
      { id: 'e8', shipmentId: 's1', eventType: 'in_transit_international', description: 'Arrived at Lagos Airport for import clearance', locationName: 'Murtala Muhammed Airport', country: 'NG', team: 'Destination customs', occurredAt: '2026-03-18T06:30:00Z' },
      { id: 'e9', shipmentId: 's1', eventType: 'customs_cleared', description: 'Import clearance approved and duties reconciled', locationName: 'Apapa Port, Lagos', country: 'NG', team: 'Customs desk', occurredAt: '2026-03-18T14:45:00Z' },
      { id: 'e10', shipmentId: 's1', eventType: 'at_destination_warehouse', description: 'Transferred to Lagos destination warehouse for last-mile staging', locationName: 'Lagos HQ Warehouse', country: 'NG', team: 'Destination warehouse', occurredAt: '2026-03-19T09:00:00Z' },
      { id: 'e11', shipmentId: 's1', eventType: 'out_for_delivery', description: 'Driver Adebayo Ogundimu dispatched for final delivery', locationName: 'Lagos, NG', country: 'NG', team: 'Dispatch', occurredAt: '2026-03-25T09:20:00Z' },
      { id: 'e12', shipmentId: 's1', eventType: 'delivered', description: 'Delivered with POD photo, signature, and handoff code', locationName: 'Lekki Phase 1, Lagos', country: 'NG', team: 'Driver', occurredAt: '2026-03-25T15:10:00Z' },
    ],
  },
  {
    id: 's2',
    trackingNumber: 'DS-20260316-D4E5F6',
    userId: 'u1',
    responsibleTeam: 'Domestic operations + dispatch',
    corridor: 'NG -> NG',
    routeLabel: 'Abuja pickup -> regional line haul -> Port Harcourt delivery',
    shipmentType: 'parcel',
    serviceType: 'standard',
    status: 'out_for_delivery',
    originCountry: 'NG',
    destinationCountry: 'NG',
    pickupAddress: {
      id: 'a3',
      label: 'Abuja Hub',
      type: 'warehouse',
      recipientName: 'LogiX Abuja',
      recipientPhone: '+2349023456789',
      addressLine1: 'Plot 456, Wuse Zone 5',
      city: 'Abuja',
      stateProvince: 'FCT',
      postalCode: '900001',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'a4',
      label: 'Retail Store',
      type: 'commercial',
      recipientName: 'Grace Nwosu',
      recipientPhone: '+2348023456789',
      addressLine1: '26 Trans Amadi Industrial Layout',
      addressLine2: 'Mile 3 axis',
      city: 'Port Harcourt',
      stateProvince: 'Rivers',
      postalCode: '500101',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 5.2,
    chargeableWeightKg: 5.2,
    declaredValue: 150,
    currency: 'NGN',
    packageDescription: 'Clothing items - Ankara fabrics',
    isInsured: false,
    insuranceCost: 0,
    shippingCost: 12500,
    customsDuties: 0,
    totalCost: 12500,
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    pickupDate: '2026-03-14',
    estimatedDeliveryDate: '2026-03-18',
    customsDocsStatus: 'not_required',
    etaConfidence: 89,
    complianceFlags: ['Payment confirmed', 'Domestic line-haul scanned', 'Driver assigned'],
    createdAt: '2026-03-14T08:00:00Z',
    trackingEvents: [
      { id: 'e9', shipmentId: 's2', eventType: 'booked', description: 'Domestic shipment booked', locationName: 'Abuja, NG', country: 'NG', team: 'Customer care', occurredAt: '2026-03-14T08:00:00Z' },
      { id: 'e10', shipmentId: 's2', eventType: 'picked_up', description: 'Parcel collected from Abuja hub', locationName: 'Abuja, NG', country: 'NG', team: 'Origin warehouse', occurredAt: '2026-03-14T10:00:00Z' },
      { id: 'e11', shipmentId: 's2', eventType: 'in_transit_domestic', description: 'Regional line haul to Port Harcourt in progress', locationName: 'Lokoja Transit Hub', country: 'NG', team: 'Line haul', occurredAt: '2026-03-16T06:00:00Z' },
      { id: 'e12', shipmentId: 's2', eventType: 'out_for_delivery', description: 'Out for delivery - Driver Emeka Nwosu', locationName: 'Port Harcourt', country: 'NG', team: 'Driver', occurredAt: '2026-03-18T07:30:00Z' },
    ],
  },
  {
    id: 's3',
    trackingNumber: 'DS-20260312-G7H8I9',
    userId: 'u1',
    shipmentType: 'cargo',
    serviceType: 'sea_freight',
    status: 'customs_held',
    originCountry: 'CN',
    destinationCountry: 'NG',
    routeLabel: 'China origin -> ocean transit -> customs review -> Nigeria release',
    pickupAddress: {
      id: 'a5',
      label: 'Supplier Warehouse',
      type: 'warehouse',
      recipientName: 'Guangzhou Trading Co.',
      recipientPhone: '+8613800123456',
      addressLine1: '789 Export Zone Road',
      city: 'Guangzhou',
      stateProvince: 'Guangdong',
      postalCode: '510000',
      country: 'CN',
      isDefaultPickup: false,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'a6',
      label: 'Port Apapa Warehouse',
      type: 'port',
      recipientName: 'LogiX Nigeria Ltd',
      recipientPhone: '+2349012345678',
      addressLine1: 'Apapa Port Complex',
      city: 'Lagos',
      stateProvince: 'Lagos',
      postalCode: '102102',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 1250,
    lengthCm: 200,
    widthCm: 150,
    heightCm: 180,
    volumetricWeightKg: 1080,
    chargeableWeightKg: 1250,
    declaredValue: 15000,
    currency: 'USD',
    packageDescription: 'Industrial machinery parts - 20 crates',
    isInsured: true,
    insuranceCost: 225,
    shippingCost: 2800,
    customsDuties: 4500,
    totalCost: 7525,
    paymentStatus: 'paid',
    paymentMethod: 'corporate_credit',
    pickupDate: '2026-03-01',
    estimatedDeliveryDate: '2026-04-05',
    customsDocsStatus: 'held',
    hsCode: '8481.80',
    requiresCustoms: true,
    customsReference: 'CUS-APA-118844',
    exceptionType: 'missing_customs_document',
    customsOfficer: 'T. Adeyemi',
    delayReason: 'Missing Form M and consignee authorization letter',
    documentChecklist: ['Commercial invoice', 'Packing list', 'Form M', 'PAAR', 'Bill of lading', 'Consignee authorization'],
    createdAt: '2026-03-01T06:00:00Z',
    trackingEvents: [
      { id: 'e13', shipmentId: 's3', eventType: 'booked', description: 'Freight booking confirmed', locationName: 'Guangzhou, CN', country: 'CN', team: 'Sales', occurredAt: '2026-03-01T06:00:00Z' },
      { id: 'e14', shipmentId: 's3', eventType: 'picked_up', description: 'Container loaded at supplier warehouse', locationName: 'Guangzhou, CN', country: 'CN', team: 'Origin warehouse', occurredAt: '2026-03-03T10:00:00Z' },
      { id: 'e15', shipmentId: 's3', eventType: 'at_warehouse', description: 'Arrived at Shanghai Port', locationName: 'Shanghai Port', country: 'CN', team: 'Origin warehouse', occurredAt: '2026-03-05T14:00:00Z' },
      { id: 'e16', shipmentId: 's3', eventType: 'in_transit_international', description: 'Departed Shanghai Port - MV Pacific Glory', locationName: 'Pacific Ocean', country: 'XX', team: 'Line haul', occurredAt: '2026-03-08T08:00:00Z' },
      { id: 'e17', shipmentId: 's3', eventType: 'in_transit_international', description: 'Arrived at Lagos Port - customs processing required', locationName: 'Apapa Port, Lagos', country: 'NG', team: 'Destination customs', occurredAt: '2026-03-17T16:00:00Z' },
      { id: 'e18', shipmentId: 's3', eventType: 'customs_held', description: 'Held for missing Form M and consignee authorization', locationName: 'Apapa Port, Lagos', country: 'NG', team: 'Customs desk', occurredAt: '2026-03-18T09:00:00Z' },
    ],
  },
  {
    id: 's4',
    trackingNumber: 'DS-20260317-J0K1L2',
    userId: 'u1',
    shipmentType: 'document',
    serviceType: 'express',
    status: 'delivered',
    originCountry: 'UK',
    destinationCountry: 'NG',
    pickupAddress: {
      id: 'a7',
      label: 'London Office',
      type: 'commercial',
      recipientName: 'Smith & Associates',
      recipientPhone: '+442071234567',
      addressLine1: '100 Liverpool Street',
      city: 'London',
      stateProvince: 'England',
      postalCode: 'EC2M 2RH',
      country: 'GB',
      isDefaultPickup: false,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'a8',
      label: 'Legal Office',
      type: 'commercial',
      recipientName: 'Chief Okonkwo',
      recipientPhone: '+2348034567890',
      addressLine1: 'Plot 1234, Ademola Adetokunbo Crescent',
      city: 'Abuja',
      stateProvince: 'FCT',
      postalCode: '900001',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 0.5,
    chargeableWeightKg: 0.5,
    declaredValue: 50,
    currency: 'USD',
    packageDescription: 'Legal documents - Contract papers',
    isInsured: false,
    insuranceCost: 0,
    shippingCost: 85,
    customsDuties: 0,
    totalCost: 85,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    pickupDate: '2026-03-15',
    estimatedDeliveryDate: '2026-03-17',
    actualDeliveryDate: '2026-03-17T14:30:00Z',
    customsDocsStatus: 'not_required',
    proofOfDeliveryMethod: 'signature',
    proofOfDeliveryLocation: 'Abuja, NG',
    podPhotoUrl: '/images/cell-4-lagos-delivered.jpg',
    podSignatureUrl: '/images/cell-4-lagos-delivered.jpg',
    podDeliveredAt: '2026-03-17T14:30:00Z',
    podRecipientName: 'Chief Okonkwo',
    complianceFlags: ['No duties', 'Signature captured'],
    createdAt: '2026-03-15T12:00:00Z',
    trackingEvents: [
      { id: 'e19', shipmentId: 's4', eventType: 'booked', description: 'Express document shipment booked', locationName: 'London, UK', country: 'GB', team: 'Customer care', occurredAt: '2026-03-15T12:00:00Z' },
      { id: 'e20', shipmentId: 's4', eventType: 'picked_up', description: 'Documents collected', locationName: 'London, UK', country: 'GB', team: 'Origin warehouse', occurredAt: '2026-03-15T15:00:00Z' },
      { id: 'e21', shipmentId: 's4', eventType: 'in_transit_international', description: 'Flown to Lagos - BA Flight 257', locationName: 'Lagos Airport', country: 'NG', team: 'Line haul', occurredAt: '2026-03-16T08:00:00Z' },
      { id: 'e22', shipmentId: 's4', eventType: 'customs_cleared', description: 'Documents released - no duties applicable', locationName: 'Lagos, NG', country: 'NG', team: 'Destination customs', occurredAt: '2026-03-16T12:00:00Z' },
      { id: 'e23', shipmentId: 's4', eventType: 'out_for_delivery', description: 'Out for delivery', locationName: 'Abuja', country: 'NG', team: 'Dispatch', occurredAt: '2026-03-17T08:00:00Z' },
      { id: 'e24', shipmentId: 's4', eventType: 'delivered', description: 'Delivered and signed - Chief Okonkwo', locationName: 'Abuja, NG', country: 'NG', team: 'Driver', occurredAt: '2026-03-17T14:30:00Z' },
    ],
  },
  {
    id: 's5',
    trackingNumber: 'DS-20260319-M4N5O6',
    userId: 'u1',
    assignedDriverId: 'd3',
    assignedDriverName: 'Emeka Nwosu',
    responsibleTeam: 'Dispatch + driver support',
    corridor: 'NG -> NG',
    routeLabel: 'Nigeria pickup -> regional delivery -> proof of delivery',
    shipmentType: 'parcel',
    serviceType: 'standard',
    status: 'out_for_delivery',
    originCountry: 'NG',
    destinationCountry: 'NG',
    pickupAddress: {
      id: 'a9',
      label: 'Lagos hub',
      type: 'warehouse',
      recipientName: 'LogiX Lagos',
      recipientPhone: '+2349012345678',
      addressLine1: '15 Industrial Layout',
      city: 'Lagos',
      stateProvince: 'Lagos',
      postalCode: '10176',
      country: 'NG',
      isDefaultPickup: true,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'a10',
      label: 'Shop',
      type: 'commercial',
      recipientName: 'Grace Nwosu',
      recipientPhone: '+2348023456789',
      addressLine1: '42 Aba Road',
      city: 'Port Harcourt',
      stateProvince: 'Rivers',
      postalCode: '500101',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 3.8,
    chargeableWeightKg: 3.8,
    declaredValue: 120,
    currency: 'NGN',
    packageDescription: 'Retail samples and catalogues',
    isInsured: false,
    insuranceCost: 0,
    shippingCost: 9200,
    customsDuties: 0,
    totalCost: 9200,
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    pickupDate: '2026-03-19',
    estimatedDeliveryDate: '2026-03-21',
    customsDocsStatus: 'not_required',
    proofOfDeliveryMethod: 'otp',
    proofOfDeliveryLocation: 'Port Harcourt, NG',
    exceptionType: 'failed_first_delivery_attempt',
    deliveryAttempts: 2,
    podRecipientName: 'Grace Nwosu',
    podLocationName: 'Port Harcourt, NG',
    handoffNotes: 'First attempt failed due to recipient unavailable; driver reattempt completed with OTP',
    complianceFlags: ['Recipient notified', 'First attempt failed', 'Reattempt completed'],
    etaConfidence: 88,
    notes: 'First attempt failed because the recipient was unavailable. Driver rebooked for next day.',
    createdAt: '2026-03-19T09:15:00Z',
    trackingEvents: [
      { id: 'e25', shipmentId: 's5', eventType: 'booked', description: 'Domestic shipment booked and paid', locationName: 'Lagos, NG', country: 'NG', team: 'Customer care', occurredAt: '2026-03-19T09:15:00Z' },
      { id: 'e26', shipmentId: 's5', eventType: 'picked_up', description: 'Parcel collected from Lagos hub', locationName: 'Lagos, NG', country: 'NG', team: 'Origin warehouse', occurredAt: '2026-03-19T12:00:00Z' },
      { id: 'e27', shipmentId: 's5', eventType: 'in_transit_domestic', description: 'Moved to Port Harcourt line haul', locationName: 'Onitsha Transit Hub', country: 'NG', team: 'Line haul', occurredAt: '2026-03-20T06:45:00Z' },
      { id: 'e28', shipmentId: 's5', eventType: 'out_for_delivery', description: 'Out for delivery with Emeka Nwosu', locationName: 'Port Harcourt, NG', country: 'NG', team: 'Driver', occurredAt: '2026-03-21T08:05:00Z' },
      { id: 'e29', shipmentId: 's5', eventType: 'failed_delivery', description: 'First attempt failed - recipient unavailable', locationName: 'Port Harcourt, NG', country: 'NG', team: 'Driver support', occurredAt: '2026-03-21T13:40:00Z' },
      { id: 'e30', shipmentId: 's5', eventType: 'out_for_delivery', description: 'Reattempt scheduled after customer notification', locationName: 'Port Harcourt, NG', country: 'NG', team: 'Customer support', occurredAt: '2026-03-21T18:00:00Z' },
    ],
  },
];

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  shipments: mockShipments,
  currentShipment: null,
  getShipmentById: (id) => get().shipments.find(s => s.id === id),
  getShipmentByTracking: (tracking) => get().shipments.find(s => s.trackingNumber === tracking),
}));

interface DriverState {
  currentDriver: Driver | null;
  drivers: Driver[];
  isOnline: boolean;
  toggleOnline: () => void;
  setCurrentDriver: (driver: Driver | null) => void;
}

const mockDrivers: Driver[] = [
  { id: 'd1', userId: 'd1', name: 'Adebayo Ogundimu', avatar: 'AO', phone: '+2348012345678', licenseNumber: 'DL-284-ABC', licenseExpiry: '2027-05-15', vehicleType: 'Van', currentVehiclePlate: 'LG-284-KJA', isOnline: true, isAvailable: false, status: 'on_delivery', totalDeliveries: 847, onTimeRate: 94.5, rating: 4.8, earningsBalance: 125000, branchId: 'b1', branchName: 'Lagos HQ', currentLocation: 'Ikeja, Lagos', activeShipments: 3, completedToday: 7 },
  { id: 'd2', userId: 'd2', name: 'Chinwe Eze', avatar: 'CE', phone: '+2348023456789', licenseNumber: 'DL-112-DEF', licenseExpiry: '2026-08-20', vehicleType: 'Truck', currentVehiclePlate: 'AB-112-RSH', isOnline: true, isAvailable: true, status: 'available', totalDeliveries: 562, onTimeRate: 97.2, rating: 4.9, earningsBalance: 89000, branchId: 'b2', branchName: 'Abuja Branch', currentLocation: 'Garki, Abuja', activeShipments: 2, completedToday: 5 },
  { id: 'd3', userId: 'd3', name: 'Emeka Nwosu', avatar: 'EN', phone: '+2348034567890', licenseNumber: 'DL-931-GHI', licenseExpiry: '2027-02-10', vehicleType: 'Motorcycle', currentVehiclePlate: 'LG-931-EPE', isOnline: true, isAvailable: true, status: 'available', totalDeliveries: 1243, onTimeRate: 98.1, rating: 4.7, earningsBalance: 156000, branchId: 'b1', branchName: 'Lagos HQ', currentLocation: 'Lekki, Lagos', activeShipments: 0, completedToday: 11 },
  { id: 'd4', userId: 'd4', name: 'Fatima Bello', avatar: 'FB', phone: '+2348045678901', licenseNumber: 'DL-445-JKL', licenseExpiry: '2026-12-01', vehicleType: 'Van', currentVehiclePlate: 'KN-445-BUK', isOnline: true, isAvailable: false, status: 'on_break', totalDeliveries: 312, onTimeRate: 92.8, rating: 4.6, earningsBalance: 45000, branchId: 'b3', branchName: 'Kano Branch', currentLocation: 'Sabon Gari, Kano', activeShipments: 0, completedToday: 4 },
  { id: 'd5', userId: 'd5', name: 'Ibrahim Musa', avatar: 'IM', phone: '+2348056789012', licenseNumber: 'DL-778-MNO', licenseExpiry: '2027-09-30', vehicleType: 'Truck', currentVehiclePlate: 'PH-778-RVS', isOnline: true, isAvailable: true, status: 'available', totalDeliveries: 489, onTimeRate: 95.6, rating: 4.5, earningsBalance: 67000, branchId: 'b4', branchName: 'Port Harcourt Branch', currentLocation: 'Trans Amadi, PH', activeShipments: 1, completedToday: 3 },
  { id: 'd6', userId: 'd6', name: 'Grace Okafor', avatar: 'GO', phone: '+2348067890123', licenseNumber: 'DL-556-PQR', licenseExpiry: '2026-04-15', vehicleType: 'Van', currentVehiclePlate: 'LG-556-VIC', isOnline: false, isAvailable: false, status: 'offline', totalDeliveries: 234, onTimeRate: 91.2, rating: 4.4, earningsBalance: 32000, branchId: 'b1', branchName: 'Lagos HQ', currentLocation: 'Last seen: VI, Lagos', activeShipments: 0, completedToday: 0 },
];

export const useDriverStore = create<DriverState>((set) => ({
  currentDriver: mockDrivers[0],
  drivers: mockDrivers,
  isOnline: true,
  toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
  setCurrentDriver: (driver) => set({ currentDriver: driver }),
}));

interface AdminState {
  kpis: KPIData;
  activity: ActivityItem[];
  getKPIs: () => KPIData;
}

const mockKPIs: KPIData = {
  totalShipments: 1847,
  activeToday: 42,
  inTransit: 18,
  delivered: 24,
  delayed: 3,
  revenue: '$24,500',
  revenueChange: '+8.2%',
  onTimeRate: 96.3,
  avgDeliveryTime: '2.4 days',
  activeDrivers: 28,
  totalDrivers: 35,
  fleetUtilization: 80,
  pendingPayments: '$3,200',
  customsHolds: 2,
};

const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'shipment', message: 'DS-20260316-D4E5F6 marked Out for Delivery on Abuja -> Port Harcourt lane', time: '2 min ago', severity: 'info' },
  { id: 'a2', type: 'alert', message: 'DS-20260312-G7H8I9 customs hold — missing Form M documentation', time: '18 min ago', severity: 'warning' },
  { id: 'a3', type: 'payment', message: '$2,150 payment received from TechCorp Ltd', time: '34 min ago', severity: 'success' },
  { id: 'a4', type: 'driver', message: 'Emeka Nwosu completed 11 deliveries today — new daily record', time: '1 hr ago', severity: 'success' },
  { id: 'a5', type: 'alert', message: 'Vehicle LG-556-VIC offline for 4+ hours — Grace Okafor unreachable', time: '1.5 hr ago', severity: 'critical' },
  { id: 'a6', type: 'shipment', message: 'DS-20260315-XYZ789 flagged CRITICAL — cold-chain pharma, time-sensitive', time: '2 hr ago', severity: 'warning' },
  { id: 'a7', type: 'system', message: 'Daily report generated — 96.3% on-time rate', time: '3 hr ago', severity: 'info' },
  { id: 'a8', type: 'shipment', message: 'DS-20260317-J0K1L2 delivered — POD confirmed with signature', time: '4 hr ago', severity: 'success' },
];

export const useAdminStore = create<AdminState>(() => ({
  kpis: mockKPIs,
  activity: mockActivity,
  getKPIs: () => mockKPIs,
}));

interface WalletState {
  wallet: Wallet;
  transactions: Transaction[];
  topUp: (amount: number, currency: string) => Promise<boolean>;
}

const mockWallet: Wallet = {
  balanceUSD: 1250.00,
  balanceNGN: 485000,
  balanceGHS: 3200,
  balanceKES: 89000,
  isFrozen: false,
};

const mockTransactions: Transaction[] = [
  { id: 't1', walletId: 'w1', type: 'credit', category: 'topup', amount: 500, currency: 'USD', balanceBefore: 750, balanceAfter: 1250, reference: 'TXN-001', description: 'Wallet top-up via Stripe', createdAt: '2026-03-15T10:00:00Z' },
  { id: 't2', walletId: 'w1', type: 'debit', category: 'shipment', amount: 145, currency: 'USD', balanceBefore: 1250, balanceAfter: 1105, reference: 'SHP-DS-20260318', shipmentId: 's1', description: 'Shipping cost - DS-20260318-A1B2C3', createdAt: '2026-03-15T10:30:00Z' },
  { id: 't3', walletId: 'w1', type: 'credit', category: 'refund', amount: 45, currency: 'USD', balanceBefore: 1105, balanceAfter: 1150, reference: 'RFND-001', shipmentId: 's-old', description: 'Partial refund - cancelled add-on', createdAt: '2026-03-14T15:00:00Z' },
  { id: 't4', walletId: 'w1', type: 'credit', category: 'topup', amount: 100, currency: 'USD', balanceBefore: 1050, balanceAfter: 1150, reference: 'TXN-002', description: 'Wallet top-up via Stripe', createdAt: '2026-03-10T09:00:00Z' },
];

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: mockWallet,
  transactions: mockTransactions,
  topUp: async (amount, currency) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const key = currency === 'USD' ? 'balanceUSD' : currency === 'NGN' ? 'balanceNGN' : currency === 'GHS' ? 'balanceGHS' : 'balanceKES';
    set(state => ({
      wallet: { ...state.wallet, [key]: state.wallet[key] + amount },
      transactions: [...get().transactions, {
        id: `t${Date.now()}`,
        walletId: 'w1',
        type: 'credit',
        category: 'topup',
        amount,
        currency,
        balanceBefore: get().wallet[key],
        balanceAfter: get().wallet[key] + amount,
        reference: `TXN-${Date.now()}`,
        description: `Wallet top-up via ${currency}`,
        createdAt: new Date().toISOString(),
      }],
    }));
    return true;
  },
}));

interface QuoteState {
  quotes: Quote[];
  generateQuotes: (params: { origin: string; destination: string; weight: number; type: string }) => Quote[];
}

const mockQuotes: Quote[] = [
  {
    id: 'q1',
    serviceId: 'express-air',
    serviceName: 'Express Air Freight',
    serviceType: 'express',
    price: 245,
    currency: 'USD',
    estimatedDays: { min: 3, max: 5 },
    includesCustoms: true,
    aiRecommended: true,
    confidenceScore: 92,
    breakdown: { base: 150, fuel: 35, customsEstimate: 45, insurance: 15 },
  },
  {
    id: 'q2',
    serviceId: 'standard-air',
    serviceName: 'Standard Air',
    serviceType: 'standard',
    price: 145,
    currency: 'USD',
    estimatedDays: { min: 7, max: 10 },
    includesCustoms: true,
    aiRecommended: false,
    confidenceScore: 78,
    breakdown: { base: 95, fuel: 25, customsEstimate: 20, insurance: 5 },
  },
  {
    id: 'q3',
    serviceId: 'economy-sea',
    serviceName: 'Economy Sea Freight',
    serviceType: 'sea_freight',
    price: 85,
    currency: 'USD',
    estimatedDays: { min: 25, max: 35 },
    includesCustoms: false,
    aiRecommended: false,
    confidenceScore: 65,
    breakdown: { base: 45, fuel: 15, customsEstimate: 20, insurance: 5 },
  },
];

export const useQuoteStore = create<QuoteState>(() => ({
  quotes: mockQuotes,
  generateQuotes: () => mockQuotes,
}));

interface WarehouseState {
  warehouses: Warehouse[];
  getWarehouseById: (id: string) => Warehouse | undefined;
}

const mockWarehouses: Warehouse[] = [
  { id: 'wh1', name: 'Atlanta Hub', type: 'origin', country: 'US', address: { id: 'wa1', label: 'Main Warehouse', type: 'warehouse', recipientName: 'LogiX Atlanta', recipientPhone: '+14045551234', addressLine1: '456 Logistics Way', city: 'Atlanta', stateProvince: 'GA', postalCode: '30318', country: 'US', isDefaultPickup: true, isDefaultDelivery: false }, capacityM3: 5000, usedCapacityM3: 3200, managerId: 'u-wh1', managerName: 'Michael Chen', isActive: true, operatingHours: { mon: { open: '08:00', close: '18:00' }, tue: { open: '08:00', close: '18:00' } } },
  { id: 'wh2', name: 'Lagos HQ Warehouse', type: 'destination', country: 'NG', address: { id: 'wa2', label: 'Lagos Main', type: 'warehouse', recipientName: 'LogiX Nigeria', recipientPhone: '+2349012345678', addressLine1: '15 Industrial Layout', city: 'Lagos', stateProvince: 'Lagos', postalCode: '10176', country: 'NG', isDefaultPickup: true, isDefaultDelivery: true }, capacityM3: 8000, usedCapacityM3: 5600, managerId: 'u-wh2', managerName: 'Tunde Adeyemi', isActive: true, operatingHours: { mon: { open: '07:00', close: '20:00' } } },
  { id: 'wh3', name: 'Accra Transit Hub', type: 'transit', country: 'GH', address: { id: 'wa3', label: 'Accra Hub', type: 'warehouse', recipientName: 'LogiX Ghana', recipientPhone: '+233245678901', addressLine1: 'Factory Junction', city: 'Accra', stateProvince: 'Greater Accra', postalCode: 'GA-123', country: 'GH', isDefaultPickup: true, isDefaultDelivery: false }, capacityM3: 3000, usedCapacityM3: 1800, managerId: 'u-wh3', managerName: 'Kwame Asante', isActive: true, operatingHours: { mon: { open: '08:00', close: '18:00' } } },
];

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  warehouses: mockWarehouses,
  getWarehouseById: (id) => get().warehouses.find(w => w.id === id),
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const mockNotifications: Notification[] = [
  { id: 'n1', userId: 'u1', type: 'shipment_update', title: 'Package in Transit', body: 'Your shipment DS-20260318-A1B2C3 has arrived in Lagos and is being processed', channels: ['push', 'email'], isRead: false, createdAt: '2026-03-18T06:30:00Z' },
  { id: 'n2', userId: 'u1', type: 'delivery_update', title: 'Out for Delivery', body: 'Your shipment DS-20260316-D4E5F6 is out for delivery in Port Harcourt', channels: ['push', 'sms'], isRead: false, createdAt: '2026-03-18T07:30:00Z' },
  { id: 'n3', userId: 'u1', type: 'customs_action', title: 'Customs Action Required', body: 'Your shipment DS-20260312-G7H8I9 requires additional documentation (Form M)', channels: ['push', 'email'], isRead: false, createdAt: '2026-03-18T09:00:00Z' },
  { id: 'n4', userId: 'u1', type: 'delivered', title: 'Delivery Confirmed', body: 'Your shipment DS-20260317-J0K1L2 has been delivered to Chief Okonkwo', channels: ['push', 'email'], isRead: true, createdAt: '2026-03-17T14:30:00Z' },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    unreadCount: state.notifications.filter(n => !n.isRead && n.id !== id).length,
  })),
  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),
}));

interface BranchState {
  branches: Branch[];
}

const mockBranches: Branch[] = [
  { id: 'b1', name: 'Lagos HQ', type: 'hq', country: 'NG', address: { id: 'ba1', label: 'HQ', type: 'commercial', recipientName: 'LogiX Nigeria', recipientPhone: '+2349012345678', addressLine1: '15 Admiralty Way', city: 'Lagos', stateProvince: 'Lagos', postalCode: '10176', country: 'NG', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr1', managerName: 'Tunde Adeyemi', phone: '+2349012345678', email: 'lagos@logix.com', isActive: true, shipmentCount: 892, revenue: 45200 },
  { id: 'b2', name: 'Abuja Branch', type: 'branch', country: 'NG', address: { id: 'ba2', label: 'Abuja', type: 'commercial', recipientName: 'LogiX Abuja', recipientPhone: '+2349023456789', addressLine1: 'Plot 456, Wuse Zone 5', city: 'Abuja', stateProvince: 'FCT', postalCode: '900001', country: 'NG', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr2', managerName: 'Amina Sani', phone: '+2349023456789', email: 'abuja@logix.com', isActive: true, shipmentCount: 423, revenue: 21500 },
  { id: 'b3', name: 'Kano Branch', type: 'branch', country: 'NG', address: { id: 'ba3', label: 'Kano', type: 'commercial', recipientName: 'LogiX Kano', recipientPhone: '+2349034567890', addressLine1: '19 Bompai Road', city: 'Kano', stateProvince: 'Kano', postalCode: '700001', country: 'NG', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr3', managerName: 'Ibrahim Musa', phone: '+2349034567890', email: 'kano@logix.com', isActive: true, shipmentCount: 187, revenue: 9400 },
  { id: 'b4', name: 'Port Harcourt Branch', type: 'branch', country: 'NG', address: { id: 'ba4', label: 'PH', type: 'commercial', recipientName: 'LogiX PH', recipientPhone: '+2349045678901', addressLine1: '26 Trans Amadi Industrial', city: 'Port Harcourt', stateProvince: 'Rivers', postalCode: '500001', country: 'NG', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr4', managerName: 'Emeka Nwankwo', phone: '+2349045678901', email: 'portharcourt@logix.com', isActive: true, shipmentCount: 234, revenue: 11800 },
  { id: 'b5', name: 'Accra Agent', type: 'agent', country: 'GH', address: { id: 'ba5', label: 'Accra', type: 'commercial', recipientName: 'LogiX Ghana', recipientPhone: '+233245678901', addressLine1: 'Factory Junction', city: 'Accra', stateProvince: 'Greater Accra', postalCode: 'GA-123', country: 'GH', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr5', managerName: 'Kwame Asante', phone: '+233245678901', email: 'accra@logix.gh', isActive: true, commissionRate: 5.5, shipmentCount: 156, revenue: 7800 },
  { id: 'b6', name: 'Nairobi Agent', type: 'agent', country: 'KE', address: { id: 'ba6', label: 'Nairobi', type: 'commercial', recipientName: 'LogiX Kenya', recipientPhone: '+254712345678', addressLine1: 'Mombasa Road Industrial', city: 'Nairobi', stateProvince: 'Nairobi', postalCode: '00100', country: 'KE', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr6', managerName: 'Wanjiku Kamau', phone: '+254712345678', email: 'nairobi@logix.ke', isActive: true, commissionRate: 6.0, shipmentCount: 89, revenue: 4500 },
  { id: 'b7', name: 'Atlanta HQ', type: 'hq', country: 'US', address: { id: 'ba7', label: 'Atlanta', type: 'commercial', recipientName: 'LogiX US', recipientPhone: '+14045551234', addressLine1: '456 Logistics Way', city: 'Atlanta', stateProvince: 'GA', postalCode: '30318', country: 'US', isDefaultPickup: true, isDefaultDelivery: true }, managerId: 'u-mgr7', managerName: 'Michael Chen', phone: '+14045551234', email: 'atlanta@logix.com', isActive: true, shipmentCount: 456, revenue: 52000 },
];

export const useBranchStore = create<BranchState>(() => ({
  branches: mockBranches,
}));

interface VehicleState {
  vehicles: Vehicle[];
}

const mockVehicles: Vehicle[] = [
  { id: 'v1', plateNumber: 'LG-284-KJA', type: 'van', make: 'Mercedes', model: 'Sprinter', year: 2023, capacityKg: 1500, capacityVolumeM3: 12, country: 'NG', currentDriverId: 'd1', currentDriverName: 'Adebayo Ogundimu', status: 'on_trip', lastLat: 6.4541, lastLng: 3.3947 },
  { id: 'v2', plateNumber: 'AB-112-RSH', type: 'truck', make: 'Isuzu', model: 'NPR', year: 2022, capacityKg: 4000, capacityVolumeM3: 25, country: 'NG', currentDriverId: 'd2', currentDriverName: 'Chinwe Eze', status: 'available', lastLat: 9.0579, lastLng: 7.4951 },
  { id: 'v3', plateNumber: 'LG-931-EPE', type: 'motorcycle', make: 'Honda', model: 'Click 125i', year: 2024, capacityKg: 50, capacityVolumeM3: 0.5, country: 'NG', currentDriverId: 'd3', currentDriverName: 'Emeka Nwosu', status: 'available', lastLat: 6.4316, lastLng: 3.4236 },
  { id: 'v4', plateNumber: 'KN-445-BUK', type: 'van', make: 'Ford', model: 'Transit', year: 2021, capacityKg: 1200, capacityVolumeM3: 10, country: 'NG', currentDriverId: 'd4', currentDriverName: 'Fatima Bello', status: 'maintenance', lastLat: 12.0022, lastLng: 8.5920 },
  { id: 'v5', plateNumber: 'PH-778-RVS', type: 'truck', make: 'Hino', model: '300', year: 2023, capacityKg: 5000, capacityVolumeM3: 30, country: 'NG', currentDriverId: 'd5', currentDriverName: 'Ibrahim Musa', status: 'on_trip', lastLat: 4.7777, lastLng: 7.0134 },
  { id: 'v6', plateNumber: 'LG-556-VIC', type: 'van', make: 'Toyota', model: 'Hiace', year: 2020, capacityKg: 1000, capacityVolumeM3: 8, country: 'NG', currentDriverId: 'd6', currentDriverName: 'Grace Okafor', status: 'inactive', lastLat: 6.4541, lastLng: 3.3947 },
];

export const useVehicleStore = create<VehicleState>(() => ({
  vehicles: mockVehicles,
}));

export { usePricingStore, calculatePrice } from './pricing';
export type { PriceCalculationResult } from '@/types/pricing';
export { useBookingStore } from './booking';
export type { BookingQuote } from '@/store/booking';
