import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock order data
const mockOrder = {
  id: "ORD-001",
  date: "2024-01-15",
  status: "Shipped",
  total: 299,
  subtotal: 279,
  shipping: 20,
  tax: 0,
  trackingNumber: "1Z999AA1234567890",
  estimatedDelivery: "January 18, 2024",
  shippingAddress: {
    name: "John Doe",
    address: "123 Main Street",
    city: "City, State 12345",
    phone: "+1 (555) 123-4567"
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
  ],
  timeline: [
    {
      status: "Order Placed",
      date: "January 15, 2024 at 2:30 PM",
      completed: true
    },
    {
      status: "Payment Confirmed",
      date: "January 15, 2024 at 2:35 PM", 
      completed: true
    },
    {
      status: "Processing",
      date: "January 15, 2024 at 3:00 PM",
      completed: true
    },
    {
      status: "Shipped",
      date: "January 16, 2024 at 10:00 AM",
      completed: true
    },
    {
      status: "Out for Delivery",
      date: "Estimated: January 18, 2024",
      completed: false
    },
    {
      status: "Delivered",
      date: "Estimated: January 18, 2024",
      completed: false
    }
  ]
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    switch (status) {
      case "Order Placed":
        return <Package className="h-5 w-5 text-muted-foreground" />;
      case "Shipped":
      case "Out for Delivery":
        return <Truck className="h-5 w-5 text-muted-foreground" />;
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500";
      case "Shipped": return "bg-blue-500";
      case "Processing": return "bg-yellow-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order {mockOrder.id}</h1>
              <p className="text-muted-foreground">Placed on {mockOrder.date}</p>
            </div>
            <div className="ml-auto">
              <Badge className={getStatusColor(mockOrder.status)}>
                {mockOrder.status}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrder.timeline.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        {getStatusIcon(item.status, item.completed)}
                        <div className="flex-1">
                          <div className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {item.status}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {mockOrder.trackingNumber && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="font-medium mb-2">Tracking Information</div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Tracking Number: {mockOrder.trackingNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated Delivery: {mockOrder.estimatedDelivery}
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        Track Package
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
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
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${mockOrder.total}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
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
                    <div className="text-muted-foreground">
                      {mockOrder.shippingAddress.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Reorder Items
                </Button>
                <Button className="w-full" variant="outline">
                  Download Invoice
                </Button>
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetails;