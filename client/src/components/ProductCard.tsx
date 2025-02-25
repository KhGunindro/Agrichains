import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import StageProgress from './StageProgress';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  stage: string;
  farmerId?: number;
  processorId?: number;
  distributorId?: number;
  retailerId?: number;
}

interface ProductCardProps {
  product: Product;
}

const stageColors = {
  'Registered': 'default',
  'Planted': 'secondary',
  'Harvested': 'warning',
  'Processed': 'primary',
  'Distributed': 'success',
  'In Retail': 'info',
  'Sold': 'destructive'
} as const;

const ProductCard = ({ product }: ProductCardProps) => {
  const { contract, account, role } = useWeb3();
  const [currentStage, setCurrentStage] = useState(product.stage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateStage = async () => {
      if (contract) {
        const stage = await contract.methods.showStage(product.id).call();
        setCurrentStage(stage);
      }
    };
    updateStage();
  }, [contract, product.id]);

  const handleStageUpdate = async (action: string) => {
    if (!contract || !account) return;
    setIsLoading(true);

    try {
      toast.promise(
        async () => {
          switch (action) {
            case 'plant':
              await contract.methods.plantProduct(product.id).send({ from: account });
              break;
            case 'harvest':
              await contract.methods.harvestProduct(product.id).send({ from: account });
              break;
            case 'process':
              await contract.methods.processProduct(product.id).send({ from: account });
              break;
            case 'distribute':
              await contract.methods.distributeProduct(product.id).send({ from: account });
              break;
            case 'receive':
              await contract.methods.receiveProduct(product.id).send({ from: account });
              break;
            case 'sell':
              await contract.methods.sellProduct(product.id).send({ from: account });
              break;
            default:
              throw new Error('Unknown action');
          }
          const newStage = await contract.methods.showStage(product.id).call();
          setCurrentStage(newStage);
        },
        {
          loading: `Updating product stage...`,
          success: `Product stage updated successfully!`,
          error: (err) => `Failed to update product stage: ${err.message}`,
        }
      );
    } catch (error) {
      toast.error(`Error performing ${action}:`, { description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtons = () => {
    if (!role) return null;

    const actions = {
      farmer: [
        { action: 'plant', label: 'Mark Planted', disabled: currentStage == 'Registered', variant: 'default', icon: Package },
        { action: 'harvest', label: 'Mark Harvested', disabled: currentStage !== 'Planted', variant: 'secondary', icon: Package },
      ],
      processor: [
        { action: 'process', label: 'Mark Processed', disabled: currentStage !== 'Harvested', variant: 'outline', icon: Package },
      ],
      distributor: [
        { action: 'distribute', label: 'Mark Distributed', disabled: currentStage !== 'Processed', variant: 'default', icon: Package },
      ],
      retailer: [
        { action: 'receive', label: 'Receive Product', disabled: currentStage !== 'Distributed', variant: 'secondary', icon: Package },
        { action: 'sell', label: 'Mark Sold', disabled: currentStage !== 'In Retail', variant: 'default', icon: Tag },
      ],
    };

    return actions[role.toLowerCase() as keyof typeof actions]?.map((btn) => (
      <Button
        key={btn.action}
        variant={btn.variant as any}
        size="sm"
        onClick={() => handleStageUpdate(btn.action)}
        disabled={btn.disabled || isLoading}
        className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
      >
        <btn.icon className="w-4 h-4" />
        {btn.label}
      </Button>
    ));
  };

  return (
    <Card className="w-full mx-auto transition-all duration-200 hover:shadow-lg border-2 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Product ID: #{product.id}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`text-sm font-medium ${stageColors[currentStage as keyof typeof stageColors]} shadow-sm`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {currentStage}
          </Badge>
        </div>
        <CardDescription className="text-base mt-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-6 shadow-inner">
          <StageProgress productId={product.id} currentStage={currentStage} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 bg-gradient-to-br from-slate-50/80 to-white p-4 rounded-b-lg">
        <div className="flex flex-wrap gap-3">
          {getActionButtons()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;