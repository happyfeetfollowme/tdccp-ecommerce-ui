import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 199,
    stock: 15,
    status: "Active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 299,
    stock: 8,
    status: "Active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
    description: "Advanced fitness tracking with heart rate monitoring"
  },
  {
    id: "3",
    name: "Minimalist Desk Lamp",
    category: "Home & Living",
    price: 89,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    description: "Modern LED desk lamp with adjustable brightness"
  },
  {
    id: "4",
    name: "Leather Messenger Bag",
    category: "Accessories",
    price: 159,
    stock: 23,
    status: "Active",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100",
    description: "Handcrafted leather messenger bag for professionals"
  },
  {
    id: "5",
    name: "Organic Coffee Beans",
    category: "Food & Beverage",
    price: 24,
    stock: 2,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100",
    description: "Premium organic coffee beans from Ethiopia"
  }
];

// Mock stats
const stats = [
  {
    title: "Total Products",
    value: "156",
    icon: Package,
    change: "+12"
  },
  {
    title: "Total Value",
    value: "$45,678",
    icon: DollarSign,
    change: "+8%"
  },
  {
    title: "Low Stock",
    value: "8",
    icon: AlertTriangle,
    change: "-2"
  },
  {
    title: "Categories",
    value: "12",
    icon: TrendingUp,
    change: "+1"
  }
];

const AdminProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Low Stock": return "bg-yellow-500";
      case "Out of Stock": return "bg-red-500";
      case "Inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "Active";
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    // Add product logic
    console.log("Adding product:", formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: ""
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image
    });
  };

  const handleUpdateProduct = () => {
    // Update product logic
    console.log("Updating product:", selectedProduct.id, formData);
    setSelectedProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: ""
    });
  };

  const handleDeleteProduct = (productId: string) => {
    // Delete product logic
    console.log("Deleting product:", productId);
  };

  const categories = [...new Set(mockProducts.map(p => p.category))];

  return (
    <div className="min-h-screen bg-background p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Manage your product inventory and catalog</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddProduct} className="flex-1">
                    Add Product
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No products found.</CardContent></Card>
          ) : filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex gap-3 items-center">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                  </div>
                </div>
                <div className="text-sm">Category: {product.category}</div>
                <div className="text-sm">Price: ${product.price}</div>
                <div className="text-sm">Stock: {product.stock}</div>
                <div className="text-sm">Status: <Badge className={getStatusColor(getStockStatus(product.stock))}>{getStockStatus(product.stock)}</Badge></div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Table (Desktop) */}
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-medium">${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(getStockStatus(product.stock))}>
                          {getStockStatus(product.stock)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;