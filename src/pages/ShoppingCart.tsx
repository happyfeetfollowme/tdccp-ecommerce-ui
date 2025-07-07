import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const itemsWithStock = await Promise.all(
          (data.items || []).map(async (item) => {
            try {
              const productResponse = await fetch(
                `http://localhost:3000/api/products/${item.productId}`
              );
              if (productResponse.ok) {
                const productData = await productResponse.json();
                return { ...item, stock: productData.stock };
              }
            } catch (e) {
              console.error(`Failed to fetch stock for ${item.name}`, e);
            }
            return { ...item, stock: 0 };
          })
        );
        setCartItems(itemsWithStock);
      } else {
        console.error("Failed to fetch cart");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const updateQuantity = async (productId: string, currentQuantity: number, newQuantity: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    if (newQuantity < 1) {
      await removeItem(productId);
      return;
    }

    if (newQuantity > item.stock) {
      toast({
        variant: "destructive",
        title: "Not enough stock",
        description: `Only ${item.stock} items available.`,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/api/cart/items/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prevItems) => {
          const updated = prevItems.map((cartItem) =>
            cartItem.productId === productId ? { ...cartItem, quantity: newQuantity } : cartItem
          );
          localStorage.setItem("cart", JSON.stringify(updated));
          window.dispatchEvent(new Event("cart-updated"));
          return updated;
        });
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Update failed",
          description: errorData.message || "Could not update item quantity.",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  const removeItem = async (productId: string) => {
    console.log("Removing item with productId:", productId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCartItems((prevItems) => {
          const updated = prevItems.filter((item) => item.productId !== productId);
          localStorage.setItem("cart", JSON.stringify(updated));
          window.dispatchEvent(new Event("cart-updated"));
          return updated;
        });
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Removal failed",
          description: errorData.message || "Could not remove item from cart.",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 20;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const inStockItems = cartItems.filter(item => item.stock > 0);
  const outOfStockItems = cartItems.filter(item => item.stock === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </CardContent>
                </Card>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some products to your cart to get started
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <span className="text-muted-foreground">({cartItems.length} items)</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Items in Your Cart</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inStockItems.map((item, index) => (
                      <div key={item.productId}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Image */}
                          <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.imageUrl || '/placeholder.svg'} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Details & Price (Mobile) */}
                          <div className="flex-1 space-y-1 sm:hidden">
                            <h3 className="font-medium line-clamp-2">{item.name}</h3>
                            <div className="text-md font-semibold">${item.price}</div>
                          </div>

                          {/* Details (Desktop) */}
                          <div className="hidden sm:block flex-1 space-y-1">
                            <h3 className="font-medium line-clamp-2">{item.name}</h3>
                            <div className="text-sm text-muted-foreground">Unit Price: ${item.price}</div>
                          </div>

                          {/* Quantity, Total, Remove - Grouped for mobile */}
                          <div className="flex sm:items-center justify-between sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.productId, item.quantity, item.quantity - 1)}
                                className="h-9 w-9 sm:h-10 sm:w-10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-3 py-1.5 sm:px-4 sm:py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.productId, item.quantity, item.quantity + 1)}
                                className="h-9 w-9 sm:h-10 sm:w-10"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Total Price */}
                            <div className="text-right min-w-[70px] sm:min-w-[80px]">
                              <div className="font-semibold sm:font-bold text-md sm:text-base">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.productId)}
                              className="text-destructive hover:text-destructive -mr-2 sm:ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {item.stock > 0 && item.quantity > item.stock && (
                          <p className="text-xs text-destructive mt-1 ml-2 sm:ml-[calc(5rem+1rem)]">Only {item.stock} in stock. Please reduce quantity.</p>
                        )}
                        {index < inStockItems.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive text-lg sm:text-xl">Out of Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {outOfStockItems.map((item, index) => (
                      <div key={item.productId}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 opacity-70">
                          <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium line-clamp-2">{item.name}</h3>
                            <div className="text-md sm:text-lg font-semibold">${item.price}</div>
                            <div className="text-sm text-destructive font-semibold">Out of Stock</div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="text-right min-w-[70px] sm:min-w-[80px]">
                              <div className="font-semibold sm:font-bold line-through text-md sm:text-base">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.productId)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {index < outOfStockItems.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Continue Shopping */}
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                Continue Shopping
              </Button>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Free shipping on orders over $100
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {inStockItems.length > 0 && (
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              )}

              {/* Security Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium">Secure Checkout</div>
                    <div className="text-xs text-muted-foreground">
                      Your information is protected with SSL encryption
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingCart;