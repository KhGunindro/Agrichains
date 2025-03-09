import { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import DashboardCard from '../components/DashboardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Define proper TypeScript interfaces matching smart contract structure
interface Product {
  id: number;
  name: string;
  description: string;
  stage: string;
  farmerId: number;
  processorId: number;
  distributorId: number;
  retailerId: number;
}

const Dashboard = () => {
  const { contract, role } = useWeb3();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!contract) {
          throw new Error('Smart contract not connected');
        }

        // Get product count from blockchain
        const productCount = Number(await contract.methods.productCtr().call());
        
        if (productCount === 0) {
          setProducts([]);
          return;
        }

        // Fetch all products in parallel
        const productPromises = Array.from({ length: productCount }, (_, i) => 
          contract.methods.ProductStock(i + 1).call().then(async (product: any) => ({
            id: Number(product.id),
            name: product.name,
            description: product.description,
            stage: await contract.methods.showStage(i + 1).call(),
            farmerId: Number(product.farmerId),
            processorId: Number(product.processorId),
            distributorId: Number(product.distributorId),
            retailerId: Number(product.retailerId),
          }))
        );

        const productsData = await Promise.all(productPromises);
        setProducts(productsData);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [contract]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Supply Chain Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          {role ? `Role: ${role}` : 'Not authenticated'}
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No products found in the supply chain
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <DashboardCard 
              key={product.id}
              product={{
                ...product,
                stage: product.stage.replace('Stage.', '')
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;