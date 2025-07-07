import Header from '@/components/header';
import SupplyChainMap from '@/components/supply-chain-map';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <SupplyChainMap />
      </main>
    </div>
  );
}
