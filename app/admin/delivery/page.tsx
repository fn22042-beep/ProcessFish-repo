'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Delivery {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: string;
}

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDeliveries();
  }, []);

  async function loadDeliveries() {
    try {
      const response = await fetch('/api/admin/deliveries');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load deliveries', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-gray-500">Manage delivery persons and areas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {deliveries.map((person) => (
          <Card key={person.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{person.name}</CardTitle>
                <p className="text-sm text-gray-500">{person.phone}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Area</span>
                  <span className="font-bold">{person.area}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status: <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>{person.status}</Badge></span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <MapPin className="h-4 w-4 mr-2" /> View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Areas covered by delivery partners</p>
          <div className="space-y-4 mt-4">
            {[...new Set(deliveries.map(d => d.area))].map((area) => (
              <div key={area} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">{area}</p>
                  <p className="text-sm text-gray-500">
                    {deliveries.filter(d => d.area === area).length} partners
                  </p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}