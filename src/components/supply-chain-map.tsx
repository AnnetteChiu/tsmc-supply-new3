'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Store, Truck, User, Warehouse, ChevronRight } from 'lucide-react';
import type { SupplyChainNode } from '@/types';
import SummarySidebar from './summary-sidebar';
import { cn } from '@/lib/utils';

const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'supplier',
    title: 'Supplier',
    Icon: Truck,
    details: 'Raw materials are sourced from various global suppliers and transported to manufacturing facilities. Key metrics include on-time delivery and material quality.',
    data: 'On-time delivery rate: 95%, Defect rate: 0.5%, Average lead time: 14 days.',
  },
  {
    id: 'manufacturer',
    title: 'Manufacturer',
    Icon: Factory,
    details: 'Raw materials are processed and assembled into finished goods. Production efficiency and quality control are critical at this stage.',
    data: 'Production volume: 10,000 units/week, Overall Equipment Effectiveness (OEE): 85%, Scrap rate: 1.2%.',
  },
  {
    id: 'distributor',
    title: 'Distributor',
    Icon: Warehouse,
    details: 'Finished goods are stored in distribution centers before being shipped to retailers. Inventory management is key to preventing stockouts or overstock.',
    data: 'Inventory turnover: 8.5, Average storage time: 42 days, Order fulfillment accuracy: 99.8%.',
  },
  {
    id: 'retailer',
    title: 'Retailer',
    Icon: Store,
    details: 'Products are displayed and sold to end customers through various retail channels, both online and physical.',
    data: 'Weekly sales: 1,200 units, Stockout rate: 2.5%, Customer footfall: 5,000/week.',
  },
  {
    id: 'customer',
    title: 'Customer',
    Icon: User,
    details: 'The end user who purchases and uses the product. Customer satisfaction and feedback are vital for product improvement and brand loyalty.',
    data: 'Customer satisfaction score: 4.8/5, Return rate: 3%, Repeat purchase rate: 45%.',
  },
];

const Arrow = ({ className }: { className?: string }) => (
  <div className={cn("hidden lg:flex items-center justify-center mx-4", className)}>
    <ChevronRight className="h-10 w-10 text-muted-foreground" />
  </div>
);

export default function SupplyChainMap() {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNodeClick = (node: SupplyChainNode) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <h2 className="text-3xl font-bold font-headline text-center mb-2">Supply Chain Flow</h2>
        <p className="text-muted-foreground text-center mb-8">Click on any stage to generate an AI-powered summary.</p>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
          {supplyChainNodes.map((node, index) => (
            <div key={node.id} className="contents">
              <Card
                onClick={() => handleNodeClick(node)}
                className="w-full max-w-sm lg:w-60 cursor-pointer hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <node.Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{node.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{node.details.substring(0, 70)}...</p>
                </CardContent>
              </Card>
              {index < supplyChainNodes.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
      {selectedNode && (
        <SummarySidebar
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          node={selectedNode}
        />
      )}
    </>
  );
}
