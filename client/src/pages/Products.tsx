import { useState, useEffect } from "react"
import { useWeb3 } from "../contexts/Web3Context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import ProductCard from "../components/ProductCard"

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
  const [loadError, setLoadError] = useState<string | null>(null)

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
    e.preventDefault()
    try {
      if (!contract || !account) throw new Error('Wallet not connected')
  
      await toast.promise(
        contract.methods.addProduct(newProduct.name, newProduct.description)
          .send({ from: account }),
        {
          loading: 'Adding product to blockchain...',
          success: () => {
            setNewProduct({ name: '', description: '' })
            setIsDialogOpen(false)
            loadProducts()
            return 'Product added successfully!'
          },
          error: (err) => {
            const reason = err?.data?.message || 
                          err.message.match(/reverted with reason string '(.*?)'/)?.[1] ||
                          'Unknown error'
            return `Failed to add product: ${reason}`
          }
        }
      )
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isInitialized) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <h3 className="font-bold mb-2">Connection Error</h3>
          <p className="mb-4">{error}</p>
          <Button 
            onClick={connectWallet} 
            className="bg-red-600 hover:bg-red-700 text-white"
            variant="destructive"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Supply Chain Products</h1>
          <p className="text-slate-600">Track products through every stage of production</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-slate-200"
          />
          
          {role === "owner" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  + New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-slate-900">
                    Create New Product
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={createProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Product Name</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(p => ({...p, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Description</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(p => ({...p, description: e.target.value}))}
                      required
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
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl">
          {products.length === 0 ? "No products in supply chain" : "No matching products found"}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products