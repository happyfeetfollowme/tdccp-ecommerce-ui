import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, MapPin, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const statusMap = {
    PROCESSING: "Processing",
    WAITING_FOR_PAYMENT: "Waiting for Payment",
    PAID: "Paid",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELED: "Canceled",
  };
  const getStatusColor = (status) => {
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.items && order.items.some(item => item.name.toLowerCase().includes(orderSearch.toLowerCase())));
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
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
        } else if (response.status === 401) {
          // Token expired or missing
          localStorage.removeItem("token");
          window.location.href = "http://localhost:3000/api/auth/discord";
        } else {
          // Handle other errors
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== "orders") return;
      try {
        const token = localStorage.getItem("token");
        console.log("UserProfile: Fetching orders with token:", token ? "Token present" : "No token");
        
        const response = await fetch("http://localhost:3000/api/orders", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        console.log("UserProfile: Orders response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("UserProfile: Received orders:", data);
          setOrders(data);
        } else {
          console.error("UserProfile: Failed to fetch orders:", response.status);
          const errorText = await response.text();
          console.error("UserProfile: Error response:", errorText);
        }
      } catch (error) {
        console.error("UserProfile: Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (activeTab !== "addresses") return;
      // Assuming an API endpoint for addresses exists, e.g., /api/users/addresses
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/users/addresses", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              {loadingUser ? (
                <div className="flex items-center gap-6">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="ml-auto text-right space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                    <img
                      src={user.avatar || "https://via.placeholder.com/150"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{user.name} {user.discordUsername && <span className="text-muted-foreground text-lg">({user.discordUsername})</span>}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto text-right space-y-2">
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                    <div className="text-2xl font-bold">{user.totalOrders || 0}</div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                    <div className="text-2xl font-bold">${user.totalSpent || 0}</div>
                  </div>
                </div>
              ) : (
                <div>Error loading user data.</div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={user?.firstName || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={user?.lastName || ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue={user?.phone || ""} />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <Input
                      placeholder="Search by Order ID or Product Name..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="sm:w-64"
                    />
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="WAITING_FOR_PAYMENT">Waiting for Payment</option>
                      <option value="PAID">Paid</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                  </div>
                  {loadingOrders ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-center">
                            <Badge className={getStatusColor(order.status)}>
                              {statusMap[order.status] || order.status}
                            </Badge>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-medium">${order.total}</div>
                            <div className="text-sm text-muted-foreground">{order.items.length} items</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">No orders found.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="addresses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Shipping Addresses
                    <Button size="sm">Add New Address</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingAddresses ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Delete</Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{address.address}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">No addresses found.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Order updates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Promotional emails</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Newsletter</span>
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Make profile public</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Allow data collection for analytics</span>
                      </label>
                    </div>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;