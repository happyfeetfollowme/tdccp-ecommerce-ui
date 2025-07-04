import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock order data
const mockOrder = {
  id: "ORD-001",
  date: "January 15, 2024",
  total: 299,
  subtotal: 279,
  shipping: 20,
  tax: 0,
  estimatedDelivery: "January 18-20, 2024",
  email: "john.doe@example.com",
  shippingAddress: {
    name: "John Doe",
    address: "123 Main Street",
    city: "City, State 12345"
  },
  items: [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
      price: 199,
      quantity: 1
    },
    {
      id: "2",
      name: "USB-C Cable",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100", 
      price: 29,
      quantity: 1
    }
  ]
};

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Thank you for your purchase</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number</span>
                      <span className="font-medium">{mockOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="font-medium">{mockOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Delivery</span>
                      <span className="font-medium">{mockOrder.estimatedDelivery}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Ordered */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{mockOrder.shippingAddress.name}</div>
                    <div className="text-muted-foreground">
                      {mockOrder.shippingAddress.address}
                    </div>
                    <div className="text-muted-foreground">
                      {mockOrder.shippingAddress.city}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${mockOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${mockOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${mockOrder.tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${mockOrder.total}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Confirmation Email */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Confirmation Email</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    A confirmation email has been sent to {mockOrder.email}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/orders/${mockOrder.id}`)}
                >
                  Track Your Order
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/profile")}
                >
                  View Order History
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p>Need help? Contact our customer support team at support@modernstore.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;