'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Truck, Warehouse, ChevronRight, Cpu } from 'lucide-react';
import type { SupplyChainNode } from '@/types';
import SummarySidebar from './summary-sidebar';
import { cn } from '@/lib/utils';

const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'supplier',
    title: 'Raw Material Supplier',
    Icon: Truck,
    details: 'High-purity silicon wafers and critical chemicals are sourced from specialized suppliers. Material purity is paramount for semiconductor manufacturing.',
    data: 'Silicon Wafer Purity: 99.9999999%, On-time delivery: 98%, Key Supplier: Shin-Etsu Chemical.',
  },
  {
    id: 'foundry',
    title: 'TSMC (Foundry)',
    Icon: Factory,
    details: 'Wafers are fabricated at TSMC foundries using advanced process nodes. This is a highly complex and capital-intensive stage involving photolithography.',
    data: 'Process Node: 3nm, Wafer Starts: 120,000/month, Yield Rate: ~90%, Cycle Time: 90-120 days.',
  },
  {
    id: 'osat',
    title: 'OSAT (Assembly/Test)',
    Icon: Warehouse,
    details: 'Outsourced Assembly and Test (OSAT) partners package the fabricated dies and perform final testing before shipment.',
    data: 'Packaging Type: Flip-chip, Test Escape Rate: <100 DPPM, Key Partner: ASE Technology.',
  },
  {
    id: 'distributor',
    title: 'Logistics',
    Icon: Truck,
    details: 'Finished chips are distributed globally to Original Equipment Manufacturers (OEMs) and other customers through secure logistics channels.',
    data: 'Avg. Delivery Time: 7 days, On-time fulfillment: 99.5%, Key Partner: FedEx, DHL.',
  },
  {
    id: 'customer',
    title: 'OEM/Fabless Customer',
    Icon: Cpu,
    details: 'Companies like Apple, NVIDIA, and AMD integrate the finished chips into their final products (e.g., smartphones, GPUs).',
    data: 'Key Customers: Apple, NVIDIA, AMD, Qualcomm. End Products: iPhones, GeForce GPUs, Ryzen CPUs.',
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
        <h2 className="text-3xl font-bold font-headline text-center mb-2">Semiconductor Supply Chain</h2>
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
