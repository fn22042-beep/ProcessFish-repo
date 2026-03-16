'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

export default function LiveTrackingPage() {
  // Dummy data
  const deliveries = [
    { id: '#ORD-2847', status: 'Pending', customer: 'John Doe', address: '123 Main Street, New York' },
    { id: '#ORD-2846', status: 'Processing', customer: 'Sarah Smith', address: '456 Park Avenue, New York' },
    { id: '#ORD-2848', status: 'Shipped', customer: 'David Wilson', address: '789 Broadway, New York' },
    { id: '#ORD-2845', status: 'Delivered', customer: 'Emily Brown', address: '321 5th Avenue, New York' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Delivery Tracking</h1>
        <p className="text-gray-500">Track delivery locations in real-time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Google Maps Integration</p>
                <p className="text-sm text-gray-400 mt-2">
                  Add your API key in Settings to enable map
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Sample coordinates for demo:<br />
                  Order #ORD-2847: 40.7128°N, 74.0060°W<br />
                  Order #ORD-2846: 40.7589°N, 73.9851°W<br />
                  Order #ORD-2845: 40.6892°N, 74.0445°W
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries</CardTitle>
              <p className="text-sm text-gray-500">12 deliveries scheduled</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{delivery.id}</span>
                    <Badge variant={
                      delivery.status === 'Delivered' ? 'default' :
                      delivery.status === 'Pending' ? 'destructive' :
                      'secondary'
                    }>
                      {delivery.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{delivery.customer}</p>
                  <p className="text-xs text-gray-500 mb-2">{delivery.address}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-3 w-3 mr-1" /> Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Directions
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}