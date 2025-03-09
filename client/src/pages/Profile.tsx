import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserRound, 
  Sprout, 
  Factory, 
  Truck, 
  Store, 
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Warehouse,
  Shield
} from 'lucide-react';

const Profile = () => {
  const { account, role } = useWeb3();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = () => {
    const iconClass = "w-10 h-10 text-emerald-600";
    switch(role?.toLowerCase()) {
      case 'farmer': return <Sprout className={iconClass} />;
      case 'processor': return <Factory className={iconClass} />;
      case 'distributor': return <Truck className={iconClass} />;
      case 'retailer': return <Store className={iconClass} />;
      case 'owner': return <Shield className={iconClass} />;
      default: return <UserRound className={iconClass} />;
    }
  };

  const getRoleDescription = () => {
    switch(role?.toLowerCase()) {
      case 'farmer': 
        return "You are responsible for planting crops and harvesting them when ready.";
      case 'processor': 
        return "You process harvested agricultural products into consumer-ready goods.";
      case 'distributor': 
        return "You distribute processed goods from processors to retailers.";
      case 'retailer': 
        return "You receive products from distributors and sell them to end consumers.";
      case 'owner': 
        return "You manage the entire supply chain, registering participants and products.";
      default: 
        return "Role not recognized in the supply chain.";
    }
  };

  const getRoleFunctionalities = () => {
    switch(role?.toLowerCase()) {
      case 'farmer':
        return [
          { emoji: '🌱', functionName: 'Plant Product', description: 'Marks a product as planted' },
          { emoji: '🌾', functionName: 'Harvest Product', description: 'Marks a product as harvested' }
        ];
      case 'processor':
        return [
          { emoji: '🏭', functionName: 'Process Product', description: 'Marks a product as processed' }
        ];
      case 'distributor':
        return [
          { emoji: '🚚', functionName: 'Distribute Product', description: 'Marks a product as distributed' }
        ];
      case 'retailer':
        return [
          { emoji: '📦', functionName: 'Receive Product', description: 'Marks a product as received by a retailer' },
          { emoji: '💰', functionName: 'Sell Product', description: 'Marks a product as sold' }
        ];
      case 'owner':
        return [
          { emoji: '👨‍🌾', functionName: 'Add Farmer', description: 'Registers a farmer' },
          { emoji: '🏭', functionName: 'Add Processor', description: 'Registers a processor' },
          { emoji: '🚚', functionName: 'Add Distributor', description: 'Registers a distributor' },
          { emoji: '🏪', functionName: 'Add Retailer', description: 'Registers a retailer' },
          { emoji: '🥦', functionName: 'Add Product', description: 'Registers a new product' }
        ];
      default:
        return [];
    }
  };

  const getBgPattern = () => {
    if (role?.toLowerCase() === 'farmer') return "bg-[radial-gradient(#22c55e15_1px,transparent_1px)] bg-[size:20px_20px]";
    if (role?.toLowerCase() === 'processor') return "bg-[linear-gradient(45deg,#22c55e10_25%,transparent_25%,transparent_50%,#22c55e10_50%,#22c55e10_75%,transparent_75%,transparent)] bg-[size:20px_20px]";
    if (role?.toLowerCase() === 'distributor') return "bg-[linear-gradient(90deg,#22c55e10_1px,transparent_1px),linear-gradient(0deg,#22c55e10_1px,transparent_1px)] bg-[size:20px_20px]";
    if (role?.toLowerCase() === 'retailer') return "bg-[repeating-linear-gradient(45deg,#22c55e10,#22c55e10_1px,transparent_1px,transparent_10px)] bg-[size:20px_20px]";
    if (role?.toLowerCase() === 'owner') return "bg-[conic-gradient(at_top_right,#22c55e15,transparent_30deg)] bg-[size:20px_20px]";
    return "";
  };

  if (!account) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-8 flex items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
          <Warehouse className="w-16 h-16 mx-auto text-emerald-600" />
          <CardTitle className="text-2xl">Wallet Not Connected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view your profile in the AgriSupply Chain.</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Connect Wallet</Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-white ${getBgPattern()} p-8`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Card */}
        <Card className="border-emerald-100 overflow-hidden">
          <div className="bg-emerald-600 h-24 relative">
            <div className="absolute -bottom-10 left-8 p-2 bg-white rounded-full shadow-lg border-4 border-emerald-100">
              {getRoleIcon()}
            </div>
          </div>
          <CardContent className="pt-12 pb-6 px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">{role}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="font-mono text-sm hover:bg-emerald-50"
                  >
                    {account.slice(0, 6)}...{account.slice(-4)}
                    <ClipboardCheck className="w-4 h-4 ml-2 text-emerald-600" />
                  </Button>
                  {copied && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-sm text-muted-foreground max-w-md">{getRoleDescription()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Functionalities Section */}
        <div>
          <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Your Role Functionalities
          </h2>
          
          <Card className="border-emerald-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getRoleFunctionalities().map((func, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 rounded-full">
                        <span className="text-2xl">{func.emoji}</span>
                      </div>
                      <div>
                        <div className="font-medium text-emerald-900">{func.functionName}</div>
                        <div className="text-sm text-muted-foreground">
                          {func.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supply Chain Position */}
        <div>
          <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <Warehouse className="w-5 h-5" />
            Your Position in the Supply Chain
          </h2>
          
          <Card className="border-emerald-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative p-6 pb-0">
                <div className="flex justify-between items-center mb-6">
                  <div className={`flex items-center ${role?.toLowerCase() === 'farmer' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                    <Sprout className="w-5 h-5 mr-2" />
                    <span>Farmer</span>
                  </div>
                  <div className={`flex items-center ${role?.toLowerCase() === 'processor' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                    <Factory className="w-5 h-5 mr-2" />
                    <span>Processor</span>
                  </div>
                  <div className={`flex items-center ${role?.toLowerCase() === 'distributor' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                    <Truck className="w-5 h-5 mr-2" />
                    <span>Distributor</span>
                  </div>
                  <div className={`flex items-center ${role?.toLowerCase() === 'retailer' ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                    <Store className="w-5 h-5 mr-2" />
                    <span>Retailer</span>
                  </div>
                </div>
                
                <div className="relative h-2 bg-emerald-100 rounded-full">
                  <div className={`absolute top-0 left-0 h-full bg-emerald-600 rounded-full ${
                    role?.toLowerCase() === 'farmer' ? 'w-1/5' : 
                    role?.toLowerCase() === 'processor' ? 'w-2/5' :
                    role?.toLowerCase() === 'distributor' ? 'w-3/5' :
                    role?.toLowerCase() === 'retailer' ? 'w-4/5' :
                    role?.toLowerCase() === 'owner' ? 'w-full' : 'w-0'
                  }`}></div>
                  
                  <div className={`absolute -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-600 ${
                    role?.toLowerCase() === 'farmer' ? 'left-[10%]' : 
                    role?.toLowerCase() === 'processor' ? 'left-[37%]' :
                    role?.toLowerCase() === 'distributor' ? 'left-[62%]' :
                    role?.toLowerCase() === 'retailer' ? 'left-[87%]' :
                    role?.toLowerCase() === 'owner' ? 'right-0' : 'left-0'
                  }`}></div>
                </div>
              </div>
              
              <div className="p-6 mt-6">
                <div className="text-sm text-center text-gray-500">
                  {role?.toLowerCase() === 'owner' 
                    ? "As the owner, you oversee the entire agricultural supply chain from planting to retail."
                    : `As a ${role}, you are responsible for a crucial step in bringing agricultural products from farm to table.`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;