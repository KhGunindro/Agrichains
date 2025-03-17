import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Tag, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
  'Registered': '#94a3b8',
  'Planted': '#a78bfa',
  'Harvested': '#fbbf24',
  'Processed': '#3b82f6',
  'Distributed': '#10b981',
  'In Retail': '#06b6d4',
  'Sold': '#f43f5e'
};

const stageIndexes = {
  'Registered': 0,
  'Planted': 1,
  'Harvested': 2,
  'Processed': 3,
  'Distributed': 4,
  'In Retail': 5,
  'Sold': 6
};

const stageVariants = {
  'Registered': 'default',
  'Planted': 'secondary',
  'Harvested': 'warning',
  'Processed': 'primary',
  'Distributed': 'success',
  'In Retail': 'info',
  'Sold': 'destructive'
} as const;

const DashboardCard = ({ product }: ProductCardProps) => {
  const { contract, account, role } = useWeb3();
  const [currentStage, setCurrentStage] = useState(product.stage);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animateStage, setAnimateStage] = useState(false);

  const stageEmojis = [
    { stage: 'Registered', emoji: '📝', label: 'Registered' },
    { stage: 'Planted', emoji: '🌱', label: 'Planted' },
    { stage: 'Harvested', emoji: '🚜', label: 'Harvested' },
    { stage: 'Processed', emoji: '🏭', label: 'Processed' },
    { stage: 'Distributed', emoji: '🚚', label: 'Distributed' },
    { stage: 'In Retail', emoji: '🏪', label: 'In Retail' },
    { stage: 'Sold', emoji: '💸', label: 'Sold' }
  ];

  const currentStageIndex = stageIndexes[currentStage as keyof typeof stageIndexes];

  useEffect(() => {
    const updateStage = async () => {
      if (contract) {
        const stage = await contract.methods.showStage(product.id).call();
        setCurrentStage(stage);
      }
    };
    updateStage();
  }, [contract, product.id]);

  useEffect(() => {
    setAnimateStage(true);
    const timeout = setTimeout(() => {
      setAnimateStage(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [currentStage]);

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
        { action: 'plant', label: 'Plant', disabled: currentStage !== 'Registered', variant: 'default', icon: Package },
        { action: 'harvest', label: 'Harvest', disabled: currentStage !== 'Planted', variant: 'secondary', icon: Package },
      ],
      processor: [
        { action: 'process', label: 'Process', disabled: currentStage !== 'Harvested', variant: 'outline', icon: Package },
      ],
      distributor: [
        { action: 'distribute', label: 'Distribute', disabled: currentStage !== 'Processed', variant: 'default', icon: Package },
      ],
      retailer: [
        { action: 'receive', label: 'Receive', disabled: currentStage !== 'Distributed', variant: 'secondary', icon: Package },
        { action: 'sell', label: 'Sell', disabled: currentStage !== 'In Retail', variant: 'default', icon: Tag },
      ],
    };

    const roleActions = actions[role.toLowerCase() as keyof typeof actions];
    if (!roleActions) return null;

    return (
      <div className="flex gap-2 flex-wrap">
        {roleActions.map(({ action, label, disabled, variant, icon: Icon }) => (
          <Button
            key={action}
            variant={variant as "default" | "link" | "secondary" | "destructive" | "outline" | "ghost"}
            onClick={() => handleStageUpdate(action)}
            disabled={disabled || isLoading}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full mx-auto transition-all duration-300 hover:shadow-xl border-2 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Product ID: {product.id}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`text-sm font-medium ${stageVariants[currentStage as keyof typeof stageVariants]} shadow-sm ${animateStage ? 'animate-pulse' : ''}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {currentStage}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Emoji Stage Visualization */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-4 px-2">
            {stageEmojis.map(({ stage, emoji }, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const currentColor = stageColors[stage as keyof typeof stageColors];

              return (
                <div 
                  key={stage}
                  className="relative flex flex-col items-center text-center"
                >
                  <div
                    className={`text-3xl transition-all duration-300 ${
                      isCompleted ? 'opacity-100' : 'opacity-30'
                    } ${
                      isCurrent ? 'scale-125 animate-bounce' : 'scale-100'
                    }`}
                    style={isCurrent ? { color: currentColor } : {}}
                  >
                    {emoji}
                  </div>
                  {isCurrent && (
                    <div className="absolute top-full mt-1">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${currentColor}20`,
                          color: currentColor
                        }}
                      >
                        Current
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Gradient Progress Bar */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(currentStageIndex / 6) * 100}%`,
                background: `linear-gradient(to right, 
                  ${stageColors.Registered},
                  ${stageColors.Planted},
                  ${stageColors.Harvested},
                  ${stageColors.Processed},
                  ${stageColors.Distributed},
                  ${stageColors['In Retail']},
                  ${stageColors.Sold})`
              }}
            />
          </div>
        </div>

        {/* Current Stage Info */}
        <div 
          className={`p-4 rounded-lg transition-all duration-500 transform ${animateStage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
          style={{
            background: `linear-gradient(135deg, ${stageColors[currentStage as keyof typeof stageColors]}20, ${stageColors[currentStage as keyof typeof stageColors]}10)`,
            borderLeft: `4px solid ${stageColors[currentStage as keyof typeof stageColors]}`
          }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-slate-100">
              <Package size={16} className="text-slate-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-slate-900">Current Stage: {currentStage}</h3>
              <p className="text-sm text-slate-600">
                {currentStage === 'Registered' && 'Product has been registered on the blockchain'}
                {currentStage === 'Planted' && 'Seeds have been planted by the farmer'}
                {currentStage === 'Harvested' && 'Crops have been harvested from the field'}
                {currentStage === 'Processed' && 'Raw materials have been processed into finished goods'}
                {currentStage === 'Distributed' && 'Products have been shipped to retailers'}
                {currentStage === 'In Retail' && 'Products are available in retail stores'}
                {currentStage === 'Sold' && 'Product has been purchased by the consumer'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t">
          {getActionButtons()}
        </div>

        {/* Toggle Details Button */}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show Details
            </>
          )}
        </Button>

        {/* Product Details */}
        {showDetails && (
          <div className="text-base text-slate-700 bg-slate-50 p-4 rounded-lg shadow-inner">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <p>{product.description}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-white rounded shadow-sm">
                <span className="font-medium text-slate-900 block mb-1">Farmer ID:</span> 
                <Badge variant="outline" className="bg-violet-50">
                  {product.farmerId || 'N/A'}
                </Badge>
              </div>
              <div className="p-2 bg-white rounded shadow-sm">
                <span className="font-medium text-slate-900 block mb-1">Processor ID:</span> 
                <Badge variant="outline" className="bg-blue-50">
                  {product.processorId || 'N/A'}
                </Badge>
              </div>
              <div className="p-2 bg-white rounded shadow-sm">
                <span className="font-medium text-slate-900 block mb-1">Distributor ID:</span> 
                <Badge variant="outline" className="bg-emerald-50">
                  {product.distributorId || 'N/A'}
                </Badge>
              </div>
              <div className="p-2 bg-white rounded shadow-sm">
                <span className="font-medium text-slate-900 block mb-1">Retailer ID:</span> 
                <Badge variant="outline" className="bg-cyan-50">
                  {product.retailerId || 'N/A'}
                </Badge>
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Product Journey:</h4>
              <div className="relative">
                {stageEmojis.map(({ stage, emoji }, index) => {
                  const isCompleted = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  
                  return (
                    <div key={stage} className="flex items-center mb-3">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isCompleted ? 'bg-blue-100' : 'bg-slate-100'
                        }`}
                      >
                        <span className={`text-lg ${isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                          {emoji}
                        </span>
                      </div>
                      <div className="ml-3 text-sm">
                        <span className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                          {stage}
                        </span>
                        {isCurrent && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;