import { Package2 } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Package2 className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">Supply Chain Navigator</h1>
      </div>
    </header>
  );
};

export default Header;
