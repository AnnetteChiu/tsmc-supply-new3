'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Truck, Warehouse, ChevronRight, Cpu, Microchip } from 'lucide-react';
import type { SupplyChainNode } from '@/types';
import SummarySidebar from './summary-sidebar';
import { cn } from '@/lib/utils';

const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'supplier',
    title: 'Raw Material Supplier',
    Icon: Truck,
    details: 'High-purity silicon wafers and critical chemicals are sourced from specialized suppliers in Japan. Material purity is paramount for semiconductor manufacturing.',
    data: 'Silicon Wafer Purity: 99.9999999%, On-time delivery: 98%, Key Supplier: Shin-Etsu Chemical (Japan).',
  },
  {
    id: 'jasm',
    title: 'JASM (Kumamoto)',
    Icon: Factory,
    details: 'Wafers are fabricated at Japan Advanced Semiconductor Manufacturing (JASM), a TSMC-led joint venture in Kumamoto, Japan. Focuses on mature and advanced specialty process nodes.',
    data: 'Process Nodes: 12/16nm, 22/28nm FinFET. Capacity: 55,000 wafers/month. Key partners: Sony, Denso.',
  },
  {
    id: 'tsmc-arizona',
    title: 'TSMC Arizona',
    Icon: Factory,
    details: 'TSMC is building advanced fabrication plants in Phoenix, Arizona, to serve US-based customers and strengthen the local semiconductor ecosystem. The first fab will focus on 5nm process technology.',
    data: 'Process Node: 5nm & 3nm announced. Investment: Over $65 Billion. Location: Phoenix, Arizona.',
  },
  {
    id: 'tsmc-nanjing',
    title: 'TSMC Nanjing',
    Icon: Factory,
    details: 'TSMC Nanjing is a wholly-owned subsidiary of TSMC, operating a 12-inch fab in Nanjing, China. It focuses on 16nm and 28nm process technologies to serve the local market.',
    data: 'Process Nodes: 16nm, 28nm. Location: Nanjing, China. Status: Operational.',
  },
  {
    id: 'packaging-center',
    title: 'Packaging R&D (Ibaraki)',
    Icon: Microchip,
    details: "TSMC's 3DIC R&D Center in Ibaraki, Japan, focuses on developing cutting-edge 3D integrated circuit packaging technologies.",
    data: 'Focus: CoWoS, InFO, and SoIC packaging. Collaboration: Works with Japanese material and equipment suppliers.',
  },
  {
    id: 'osat',
    title: 'OSAT (Assembly/Test)',
    Icon: Warehouse,
    details: 'Outsourced Assembly and Test (OSAT) partners, some located in Japan, package the fabricated dies and perform final testing before shipment.',
    data: 'Packaging Type: Flip-chip, Test Escape Rate: <100 DPPM, Key Partner: ASE Technology.',
  },
  {
    id: 'distributor',
    title: 'Global Logistics',
    Icon: Truck,
    details: 'Finished chips are distributed globally to Original Equipment Manufacturers (OEMs) and other customers through secure logistics channels.',
    data: 'Avg. Delivery Time: 7 days, On-time fulfillment: 99.5%, Key Partner: FedEx, DHL.',
  },
  {
    id: 'customer',
    title: 'OEM/Fabless Customer',
    Icon: Cpu,
    details: "Global tech giants and automotive leaders integrate TSMC's advanced chips into their products, from smartphones to cars.",
    data: 'Key Customers: Apple, NVIDIA, AMD, Qualcomm. End Products: CPUs, GPUs, SoCs, Automotive ICs.',
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
        <h2 className="text-3xl font-bold font-headline text-center mb-2">TSMC Global Semiconductor Supply Chain</h2>
        <p className="text-muted-foreground text-center mb-8">A look at TSMC's key manufacturing and R&D sites in Japan, the USA, and China. Click a stage for an AI summary.</p>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 flex-wrap">
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
