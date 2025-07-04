import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Package, DollarSign, Users, TrendingUp } from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2024-01-15",
    status: "Awaiting merchant confirmation",
    total: 299,
    shippingFee: null,
    items: 2,
    address: "123 Main St, City, State 12345"
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane.smith@example.com", 
    date: "2024-01-14",
    status: "Awaiting payment",
    total: 189,
    shippingFee: 15,
    items: 1,
    address: "456 Oak Ave, Town, State 67890"
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob.johnson@example.com",
    date: "2024-01-13",
    status: "Paid",
    total: 456,
    shippingFee: 25,
    items: 3,
    address: "789 Pine St, Village, State 54321"
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice.brown@example.com",
    date: "2024-01-12",
    status: "Shipped",
    total: 129,
    shippingFee: 10,
    items: 1,
    address: "321 Elm St, City, State 98765"
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    date: "2024-01-11",
    status: "Delivered",
    total: 89,
    shippingFee: 5,
    items: 1,
    address: "654 Maple Ave, Town, State 13579"
  }
];

// Mock stats
const stats = [
  {
    title: "Total Orders",
    value: "156",
    icon: Package,
    change: "+12%"
  },
  {
    title: "Revenue",
    value: "$12,345",
    icon: DollarSign,
    change: "+8%"
  },
  {
    title: "Customers",
    value: "89",
    icon: Users,
    change: "+5%"
  },
  {
    title: "Growth",
    value: "23%",
    icon: TrendingUp,
    change: "+2%"
  }
];

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shippingFee, setShippingFee] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Awaiting merchant confirmation": return "bg-yellow-500";
      case "Awaiting payment": return "bg-orange-500";
      case "Paid": return "bg-blue-500";
      case "Shipped": return "bg-purple-500";
      case "Delivered": return "bg-green-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateShippingFee = (orderId: string) => {
    // Update shipping fee logic
    console.log(`Updated shipping fee for order ${orderId}: $${shippingFee}`);
    setSelectedOrder(null);
    setShippingFee("");
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Update order status logic
    console.log(`Updated order ${orderId} status to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">Manage and track all customer orders</p>
          </div>
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

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Awaiting merchant confirmation">Awaiting Confirmation</SelectItem>
                  <SelectItem value="Awaiting payment">Awaiting Payment</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">${order.total + (order.shippingFee || 0)}</div>
                          {order.shippingFee && (
                            <div className="text-sm text-muted-foreground">
                              +${order.shippingFee} shipping
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Customer</Label>
                                    <p className="font-medium">{order.customer}</p>
                                    <p className="text-sm text-muted-foreground">{order.email}</p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">
                                      <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Shipping Address</Label>
                                  <p className="text-sm">{order.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Order Total</Label>
                                    <p className="font-medium">${order.total}</p>
                                  </div>
                                  <div>
                                    <Label>Shipping Fee</Label>
                                    <p className="font-medium">
                                      {order.shippingFee ? `$${order.shippingFee}` : "Not set"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {order.status === "Awaiting merchant confirmation" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Shipping Fee - {order.id}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="shippingFee">Shipping Fee ($)</Label>
                                    <Input
                                      id="shippingFee"
                                      type="number"
                                      value={shippingFee}
                                      onChange={(e) => setShippingFee(e.target.value)}
                                      placeholder="Enter shipping fee"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={() => handleUpdateShippingFee(order.id)} className="flex-1">
                                      Update & Confirm Order
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Awaiting merchant confirmation">Awaiting Confirmation</SelectItem>
                              <SelectItem value="Awaiting payment">Awaiting Payment</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
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

export default AdminOrders;