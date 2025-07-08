import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    walletAddress: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    price: "",
    stock: "",
    walletAddress: "",
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const walletRef = useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [images, setImages] = useState<FileList | null>(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Admin endpoint returns an array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } else {
        console.error("Failed to fetch products.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    // Required fields: name, price, stock, walletAddress
    const errors: any = { name: "", price: "", stock: "", walletAddress: "" };
    let firstErrorField: string | null = null;
    if (!formData.name.trim()) {
      errors.name = "Product Name is required.";
      firstErrorField = firstErrorField || "name";
    }
    if (!formData.price.trim()) {
      errors.price = "Price is required.";
      firstErrorField = firstErrorField || "price";
    }
    if (!formData.stock.trim()) {
      errors.stock = "Stock Quantity is required.";
      firstErrorField = firstErrorField || "stock";
    }
    if (!formData.walletAddress.trim()) {
      errors.walletAddress = "Wallet Address is required.";
      firstErrorField = firstErrorField || "walletAddress";
    }
    setFieldErrors(errors);
    // Focus the first error field
    setTimeout(() => {
      if (firstErrorField === "name" && nameRef.current) nameRef.current.focus();
      else if (firstErrorField === "price" && priceRef.current) priceRef.current.focus();
      else if (firstErrorField === "stock" && stockRef.current) stockRef.current.focus();
      else if (firstErrorField === "walletAddress" && walletRef.current) walletRef.current.focus();
    }, 0);
    if (firstErrorField) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.category) {
      data.append('category', formData.category);
    }
    if (formData.walletAddress) {
      data.append('walletAddress', formData.walletAddress);
    }
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setFormData({ name: "", category: "", price: "", stock: "", description: "", walletAddress: "" });
        setImages(null);
        setFieldErrors({ name: "", price: "", stock: "", walletAddress: "" });
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("Failed to add product:", errorData.error);
        // You can use a toast notification here to show the error
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      walletAddress: product.walletAddress || "",
    });
    setImages(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    // Required fields: name, price, stock, walletAddress
    const errors: any = { name: "", price: "", stock: "", walletAddress: "" };
    let firstErrorField: string | null = null;
    if (!formData.name.trim()) {
      errors.name = "Product Name is required.";
      firstErrorField = firstErrorField || "name";
    }
    if (!formData.price.trim()) {
      errors.price = "Price is required.";
      firstErrorField = firstErrorField || "price";
    }
    if (!formData.stock.trim()) {
      errors.stock = "Stock Quantity is required.";
      firstErrorField = firstErrorField || "stock";
    }
    if (!formData.walletAddress.trim()) {
      errors.walletAddress = "Wallet Address is required.";
      firstErrorField = firstErrorField || "walletAddress";
    }
    setFieldErrors(errors);
    setTimeout(() => {
      if (firstErrorField === "name" && nameRef.current) nameRef.current.focus();
      else if (firstErrorField === "price" && priceRef.current) priceRef.current.focus();
      else if (firstErrorField === "stock" && stockRef.current) stockRef.current.focus();
      else if (firstErrorField === "walletAddress" && walletRef.current) walletRef.current.focus();
    }, 0);
    if (firstErrorField) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.category) {
      data.append('category', formData.category);
    }
    if (formData.walletAddress) {
      data.append('walletAddress', formData.walletAddress);
    }
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (response.ok) {
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        setFormData({ name: "", category: "", price: "", stock: "", description: "", walletAddress: "" });
        setImages(null);
        setFieldErrors({ name: "", price: "", stock: "", walletAddress: "" });
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("Failed to update product:", errorData.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };


  const categories = [...new Set(products.map(p => p.category || "Uncategorized").filter(Boolean))];

  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete product:", errorData.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

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
                    <Label htmlFor="name">Product Name<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => { setFormData({...formData, name: e.target.value}); setFieldErrors(errors => ({...errors, name: ""})); }}
                      placeholder="Enter product name"
                      required
                      ref={nameRef}
                    />
                    {fieldErrors.name && <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>}
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
                    <Label htmlFor="price">Price ($)<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => { setFormData({...formData, price: e.target.value}); setFieldErrors(errors => ({...errors, price: ""})); }}
                      placeholder="0.00"
                      required
                      ref={priceRef}
                    />
                    {fieldErrors.price && <div className="text-red-500 text-xs mt-1">{fieldErrors.price}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => { setFormData({...formData, stock: e.target.value}); setFieldErrors(errors => ({...errors, stock: ""})); }}
                      placeholder="0"
                      required
                      ref={stockRef}
                    />
                    {fieldErrors.stock && <div className="text-red-500 text-xs mt-1">{fieldErrors.stock}</div>}
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
                  <Label htmlFor="walletAddress">Wallet Address<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    id="walletAddress"
                    value={formData.walletAddress}
                    onChange={(e) => { setFormData({...formData, walletAddress: e.target.value}); setFieldErrors(errors => ({...errors, walletAddress: ""})); }}
                    placeholder="Enter wallet address"
                    required
                    ref={walletRef}
                  />
                  {fieldErrors.walletAddress && <div className="text-red-500 text-xs mt-1">{fieldErrors.walletAddress}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">Product Images</Label>
                  <label htmlFor="images" className="inline-block cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                    Choose Files
                    <Input
                      id="images"
                      type="file"
                      multiple
                      onChange={(e) => setImages(e.target.files)}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {images && images.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">{images.length} file(s) selected</div>
                  )}
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
          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Product Name<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => { setFormData({...formData, name: e.target.value}); setFieldErrors(errors => ({...errors, name: ""})); }}
                      placeholder="Enter product name"
                      required
                      ref={nameRef}
                    />
                    {fieldErrors.name && <div className="text-red-500 text-xs mt-1">{fieldErrors.name}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
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
                    <Label htmlFor="edit-price">Price ($)<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => { setFormData({...formData, price: e.target.value}); setFieldErrors(errors => ({...errors, price: ""})); }}
                      placeholder="0.00"
                      required
                      ref={priceRef}
                    />
                    {fieldErrors.price && <div className="text-red-500 text-xs mt-1">{fieldErrors.price}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock Quantity<span className="text-red-500 ml-1">*</span></Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => { setFormData({...formData, stock: e.target.value}); setFieldErrors(errors => ({...errors, stock: ""})); }}
                      placeholder="0"
                      required
                      ref={stockRef}
                    />
                    {fieldErrors.stock && <div className="text-red-500 text-xs mt-1">{fieldErrors.stock}</div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-walletAddress">Wallet Address<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    id="edit-walletAddress"
                    value={formData.walletAddress}
                    onChange={(e) => { setFormData({...formData, walletAddress: e.target.value}); setFieldErrors(errors => ({...errors, walletAddress: ""})); }}
                    placeholder="Enter wallet address"
                    required
                    ref={walletRef}
                  />
                  {fieldErrors.walletAddress && <div className="text-red-500 text-xs mt-1">{fieldErrors.walletAddress}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-images">Product Images</Label>
                  <label htmlFor="edit-images" className="inline-block cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                    Choose Files
                    <Input
                      id="edit-images"
                      type="file"
                      multiple
                      onChange={(e) => setImages(e.target.files)}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {images && images.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">{images.length} file(s) selected</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProduct} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedProduct(null); setFormData({ name: "", category: "", price: "", stock: "", description: "", walletAddress: "" }); setImages(null); }} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* ...rest of your component's JSX (mobile/desktop views, table, etc.)... */}
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No products found.</CardContent></Card>
          ) : filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex gap-3 items-center">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl ? product.imageUrl : '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProductToDelete(product.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                              src={product.imageUrl ? product.imageUrl : '/placeholder.svg'}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProductToDelete(product.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-2">Are you sure you want to delete this product?</div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
