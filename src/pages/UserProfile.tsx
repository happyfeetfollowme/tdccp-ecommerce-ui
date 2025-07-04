import { useState } from "react";
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

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  joinDate: "January 2024",
  totalOrders: 12,
  totalSpent: 1567
};

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 299,
    items: 2
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    status: "Shipped",
    total: 189,
    items: 1
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "Processing",
    total: 456,
    items: 3
  }
];

// Mock addresses
const mockAddresses = [
  {
    id: "1",
    name: "Home",
    address: "123 Main Street, City, State 12345",
    isDefault: true
  },
  {
    id: "2", 
    name: "Work",
    address: "456 Business Ave, Downtown, State 67890",
    isDefault: false
  }
];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500";
      case "Shipped": return "bg-blue-500";
      case "Processing": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                  <p className="text-muted-foreground">{mockUser.email}</p>
                  <p className="text-sm text-muted-foreground">Member since {mockUser.joinDate}</p>
                </div>
                <div className="ml-auto text-right space-y-2">
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                  <div className="text-2xl font-bold">{mockUser.totalOrders}</div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                  <div className="text-2xl font-bold">${mockUser.totalSpent}</div>
                </div>
              </div>
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
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={mockUser.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
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
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.date}</div>
                        </div>
                        <div className="text-center">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium">${order.total}</div>
                          <div className="text-sm text-muted-foreground">{order.items} items</div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-4">
                    {mockAddresses.map((address) => (
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