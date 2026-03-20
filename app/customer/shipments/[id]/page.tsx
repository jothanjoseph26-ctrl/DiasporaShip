'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  Package,
  MapPin,
  Copy,
  Download,
  FileText,
  MessageSquare,
  XCircle,
  CheckCircle2,
  Clock,
  Weight,
  Ruler,
  Shield,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useShipmentStore } from '@/store';
import { formatCurrency, formatDate, formatDateTime, getStatusLabel } from '@/lib/utils';

const TRACKED_STATUSES = [
  'pending_pickup',
  'picked_up',
  'at_warehouse',
  'in_transit_international',
  'at_destination_warehouse',
  'out_for_delivery',
  'delivered',
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', NG: '🇳🇬', GB: '🇬🇧', CN: '🇨🇳', GH: '🇬🇭', KE: '🇰🇪',
};

export default function ShipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { getShipmentById } = useShipmentStore();
  const shipment = getShipmentById(params.id);
  const [copied, setCopied] = useState(false);

  if (!shipment) {
    notFound();
  }

  const currentIndex = Math.max(TRACKED_STATUSES.indexOf(shipment.status), 0);
  const progress = TRACKED_STATUSES.includes(shipment.status)
    ? ((currentIndex + 1) / TRACKED_STATUSES.length) * 100
    : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockDocuments = [
    {
      id: 'doc1',
      shipmentId: shipment.id,
      documentType: 'commercial_invoice' as const,
      fileUrl: '#',
      fileName: 'commercial_invoice.pdf',
      status: 'approved' as const,
      createdAt: shipment.createdAt,
    },
    {
      id: 'doc2',
      shipmentId: shipment.id,
      documentType: 'packing_list' as const,
      fileUrl: '#',
      fileName: 'packing_list.pdf',
      status: 'approved' as const,
      createdAt: shipment.createdAt,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-2xl font-bold text-[var(--ink)] font-mono"
            >
              {shipment.trackingNumber}
            </h1>
            <button
              onClick={handleCopy}
              className="text-[var(--muted-text)] hover:text-[var(--terra)] transition-colors"
              title="Copy tracking number"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                shipment.status === 'delivered'
                  ? 'success'
                  : shipment.status.includes('customs')
                  ? 'warning'
                  : shipment.status === 'cancelled'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {getStatusLabel(shipment.status)}
            </Badge>
            <span className="text-sm text-[var(--muted-text)] capitalize">
              {shipment.serviceType.replace('_', ' ')}
            </span>
            <span className="text-sm text-[var(--muted-text)]">&middot;</span>
            <span className="text-sm text-[var(--muted-text)]">
              Created {formatDate(shipment.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Label
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Invoice
          </Button>
          {shipment.status === 'pending_pickup' && (
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Support
          </Button>
        </div>
      </div>

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-[var(--ink)]">Journey Progress</span>
            <span className="text-xs text-[var(--muted-text)]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {TRACKED_STATUSES.map((status, index) => (
              <div
                key={status}
                className={`text-center p-2 rounded-lg text-xs font-medium transition-colors ${
                  index <= currentIndex
                    ? 'bg-[var(--terra-pale)] text-[var(--terra)] border border-[var(--terra)]/20'
                     : 'bg-[var(--cream)] text-gray-500'
                }`}
              >
                {getStatusLabel(status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--border-warm)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--terra)]" />
              Pickup Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-[var(--ink)]">{shipment.pickupAddress.recipientName}</p>
            <p className="text-sm text-[var(--muted-text)]">{shipment.pickupAddress.addressLine1}</p>
            {shipment.pickupAddress.addressLine2 && (
              <p className="text-sm text-[var(--muted-text)]">{shipment.pickupAddress.addressLine2}</p>
            )}
            <p className="text-sm text-[var(--muted-text)]">
              {shipment.pickupAddress.city}, {shipment.pickupAddress.stateProvince}{' '}
              {shipment.pickupAddress.postalCode}
            </p>
            <p className="text-sm text-[var(--muted-text)]">
              {COUNTRY_FLAGS[shipment.pickupAddress.country]} {shipment.pickupAddress.country}
            </p>
            <p className="text-sm text-[var(--muted-text)] mt-2">
              {shipment.pickupAddress.recipientPhone}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-warm)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-[var(--ink)]">{shipment.deliveryAddress.recipientName}</p>
            <p className="text-sm text-[var(--muted-text)]">{shipment.deliveryAddress.addressLine1}</p>
            {shipment.deliveryAddress.addressLine2 && (
              <p className="text-sm text-[var(--muted-text)]">{shipment.deliveryAddress.addressLine2}</p>
            )}
            <p className="text-sm text-[var(--muted-text)]">
              {shipment.deliveryAddress.city}, {shipment.deliveryAddress.stateProvince}{' '}
              {shipment.deliveryAddress.postalCode}
            </p>
            <p className="text-sm text-[var(--muted-text)]">
              {COUNTRY_FLAGS[shipment.deliveryAddress.country]} {shipment.deliveryAddress.country}
            </p>
            <p className="text-sm text-[var(--muted-text)] mt-2">
              {shipment.deliveryAddress.recipientPhone}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--border-warm)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
              <Package className="h-4 w-4 text-[var(--terra)]" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--ink)]">{shipment.packageDescription}</p>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                    <p className="text-[var(--ink)] text-xs">Type</p>
                <p className="font-medium text-[var(--ink)] capitalize">{shipment.shipmentType}</p>
              </div>
              <div>
                <p className="text-[var(--ink)] text-xs flex items-center gap-1">
                  <Weight className="h-3 w-3" /> Weight
                </p>
                <p className="font-medium text-[var(--ink)]">{shipment.weightKg} kg</p>
              </div>
              {shipment.lengthCm && (
                <div>
                  <p className="text-[var(--ink)] text-xs flex items-center gap-1">
                    <Ruler className="h-3 w-3" /> Dimensions
                  </p>
                  <p className="font-medium text-[var(--ink)]">
                    {shipment.lengthCm} &times; {shipment.widthCm} &times; {shipment.heightCm} cm
                  </p>
                </div>
              )}
              <div>
                <p className="text-[var(--ink)] text-xs">Declared Value</p>
                <p className="font-medium text-[var(--ink)]">{formatCurrency(shipment.declaredValue, shipment.currency)}</p>
              </div>
              <div>
                <p className="text-[var(--ink)] text-xs flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Insurance
                </p>
                <p className="font-medium text-[var(--ink)]">{shipment.isInsured ? 'Yes' : 'No'}</p>
              </div>
              {shipment.hsCode && (
                <div>
                  <p className="text-[var(--ink)] text-xs">HS Code</p>
                  <p className="font-mono font-medium text-[var(--ink)]">{shipment.hsCode}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-warm)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[var(--terra)]" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base shipping</span>
                <span className="font-medium text-[var(--ink)]">{formatCurrency(shipment.shippingCost, shipment.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel surcharge</span>
                <span className="font-medium text-[var(--ink)]">{formatCurrency(shipment.totalCost * 0.1, shipment.currency)}</span>
              </div>
              {shipment.customsDuties > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customs & duties</span>
                  <span className="font-medium text-[var(--ink)]">{formatCurrency(shipment.customsDuties, shipment.currency)}</span>
                </div>
              )}
              {shipment.isInsured && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium text-[var(--ink)]">{formatCurrency(shipment.insuranceCost, shipment.currency)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-[var(--ink)]">
                <span>Total</span>
                <span>{formatCurrency(shipment.totalCost, shipment.currency)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={shipment.paymentStatus === 'paid' ? 'success' : 'warning'}>
                Payment {shipment.paymentStatus}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {shipment.paymentMethod.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--border-warm)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--terra)]" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-warm)]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[var(--terra)]" />
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">{doc.documentType.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-600">{doc.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--border-warm)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--terra)]" />
            Tracking Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipment.trackingEvents
              .slice()
              .reverse()
              .map((event, index, arr) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        index === 0 ? 'bg-[var(--terra)] ring-4 ring-[var(--terra-pale)]' : 'bg-[var(--border-strong)]'
                      }`}
                    />
                    {index < arr.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--border-warm)] mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-[var(--ink)]">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-text)] mt-1">
                      <span>{formatDateTime(event.occurredAt)}</span>
                      <span>&middot;</span>
                      <span>{event.locationName}</span>
                      {event.country && (
                        <>
                          <span>&middot;</span>
                          <span>{COUNTRY_FLAGS[event.country] || ''} {event.country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
