import { useState, useEffect } from "react"
import { useWeb3 } from "../contexts/Web3Context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import ProductCard from "../components/ProductCard"
import StageProgress from "../components/StageProgress"

interface Product {
  id: number
  name: string
  description: string
  stage: string
  farmerId: number
  processorId: number
  distributorId: number
  retailerId: number
}

const Products = () => {
  const { contract, account, role, isInitialized, error, connectWallet } = useWeb3()
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", description: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string|null>(null)

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      
      if (!contract) throw new Error("Contract not initialized")
      
      const count = Number(await contract.methods.productCtr().call())
      const products = await Promise.all(
        Array.from({ length: count }, (_, i) => i + 1).map(async (id) => {
          const product = await contract.methods.ProductStock(id).call()
          return {
            id: Number(product.id),
            name: product.name,
            description: product.description,
            stage: await contract.methods.showStage(id).call(),
            farmerId: Number(product.farmerId),
            processorId: Number(product.processorId),
            distributorId: Number(product.distributorId),
            retailerId: Number(product.retailerId)
          }
        })
      )
      
      setProducts(products)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load products")
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialized && contract) {
      loadProducts()
    }
  }, [isInitialized, contract])

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!contract || !account) throw new Error('Wallet not connected');
  
      await toast.promise(
        contract.methods.addProduct(newProduct.name, newProduct.description)
          .send({ from: account }),
        {
          loading: 'Adding product to blockchain...',
          success: () => {
            setNewProduct({ name: '', description: '' });
            setIsDialogOpen(false);
            loadProducts();
            return 'Product added successfully!';
          },
          error: (err) => {
            console.error('Contract error:', err);
            const reason = err?.data?.message || 
                          err.message.match(/reverted with reason string '(.*?)'/)?.[1] ||
                          'Unknown error';
            return `Failed to add product: ${reason}`;
          }
        }
      );
    } catch (error) {
      console.error('Application error:', error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isInitialized) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-8 w-1/2 mx-auto bg-slate-200" />
          <Skeleton className="h-4 w-1/3 mx-auto bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-2">Connection Error</h3>
          <p>{error}</p>
          <Button 
            onClick={connectWallet} 
            className="mt-4 bg-red-600 hover:bg-red-700"
            variant="destructive"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
          Product Management
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white/50 p-4 rounded-lg backdrop-blur-sm">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="max-w-md bg-white/80 border-slate-200 focus:border-slate-400 transition-colors"
        />
        
        {role === "owner" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
                Create New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-slate-800">New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={createProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Product Name</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct(p => ({...p, name: e.target.value}))}
                    required
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProduct(p => ({...p, description: e.target.value}))}
                    required
                    className="bg-white/80"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-sm">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg">
          {products.length === 0 ? "No products in supply chain" : "No matching products found"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-800">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <p className="text-sm text-slate-600">{product.description}</p>
                <div className="bg-white/80 rounded-lg p-4 shadow-inner">
                  <StageProgress 
                    productId={product.id} 
                    currentStage={product.stage.replace('Stage.', '')} 
                  />
                </div>
                <ProductCard product={product} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
