import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock cart data
const initialCartItems = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
    price: 199,
    quantity: 1,
    inStock: true
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
    price: 299,
    quantity: 2,
    inStock: true
  },
  {
    id: "3",
    name: "USB-C Cable",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100",
    price: 29,
    quantity: 1,
    inStock: false
  }
];

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 20;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const inStockItems = cartItems.filter(item => item.inStock);
  const outOfStockItems = cartItems.filter(item => !item.inStock);

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
                      <div key={item.id}>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="text-lg font-bold">${item.price}</div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right min-w-[80px]">
                            <div className="font-bold">${item.price * item.quantity}</div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {index < inStockItems.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Out of Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {outOfStockItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center gap-4 opacity-60">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="text-lg font-bold">${item.price}</div>
                            <div className="text-sm text-destructive">Out of Stock</div>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <div className="font-bold line-through">${item.price * item.quantity}</div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {index < outOfStockItems.length - 1 && <Separator className="mt-4" />}
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
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Free shipping on orders over $100
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
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