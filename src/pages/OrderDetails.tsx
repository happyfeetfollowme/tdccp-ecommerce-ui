import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editTotal, setEditTotal] = useState("");
  const [editShippingFee, setEditShippingFee] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.items === 'string') {
            try {
              data.items = JSON.parse(data.items);
            } catch (e) {
              data.items = [];
            }
          }
          setOrder(data);
          setEditTotal(data.total);
          setEditShippingFee(data.shippingFee);
        } else {
          setOrder(null);
        }
      } catch (error) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch {}
    };
    if (id) {
      fetchOrder();
      fetchUser();
    }
  }, [id]);

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
      case "DELIVERED": return "bg-green-500";
      case "SHIPPED": return "bg-blue-500";
      case "PAID": return "bg-purple-500";
      case "PROCESSING": return "bg-yellow-500";
      case "WAITING_FOR_PAYMENT": return "bg-orange-500";
      case "CANCELED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const isAdmin = user && user.role === "ADMIN";
  const isUserOrder = user && order && user.id === order.userId;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-8"> {/* ...existing code... */} </div>
          ) : !order ? (
            <div className="text-center py-12"> {/* ...existing code... */} </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Order {order.id}</h1>
                  <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status, order.status === 'DELIVERED')}
                          <div className="flex-1">
                            <div className="font-medium">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.status === 'PROCESSING' ? 'Your order is being processed' :
                               order.status === 'SHIPPED' ? 'Your order has been shipped' :
                               order.status === 'DELIVERED' ? 'Your order has been delivered' :
                               order.status === 'PAID' ? 'Payment confirmed, preparing for shipment' :
                               'Status updated'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <Link to={`/products/${item.productId}`} className="hover:underline">
                                <h3 className="font-medium">{item.name}</h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              {item.walletAddress && (
                                <p className="text-xs text-muted-foreground">Wallet: {item.walletAddress}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${item.price}</div>
                              <div className="text-sm text-muted-foreground">
                                ${(item.price * item.quantity).toFixed(2)} total
                              </div>
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
                        <span>${order.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        {isAdmin ? (
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-24"
                            value={editShippingFee}
                            onChange={e => setEditShippingFee(e.target.value)}
                            disabled={saving}
                          />
                        ) : (
                          <span>${order.shippingFee}</span>
                        )}
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${(Number(order.total) + Number(isAdmin ? editShippingFee : order.shippingFee)).toFixed(2)}</span>
                      </div>
                      {isAdmin && (
                        <Button
                          className="w-full mt-2"
                          disabled={saving}
                          onClick={async () => {
                            setSaving(true);
                            try {
                              const token = localStorage.getItem("token");
                              const res = await fetch(`http://localhost:3000/api/admin/orders/${order.id}`, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                  shippingFee: Number(editShippingFee),
                                })
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setOrder(updated);
                              }
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          Save Changes
                        </Button>
                      )}
                      {/* Cancel Button for user if status is PROCESSING or WAITING_FOR_PAYMENT */}
                      {isUserOrder && (order.status === 'PROCESSING' || order.status === 'WAITING_FOR_PAYMENT') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full mt-2">Cancel Order</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this order? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Go Back</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  setSaving(true);
                                  try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch(`http://localhost:3000/api/orders/${order.id}`, {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`
                                      },
                                      body: JSON.stringify({ status: "CANCELED" })
                                    });
                                    if (res.ok) {
                                      const updated = await res.json();
                                      setOrder(updated);
                                    }
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                              >
                                Confirm Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetails;