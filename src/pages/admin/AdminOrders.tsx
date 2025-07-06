import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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


const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shippingFee, setShippingFee] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/admin/orders", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Parse items if needed, and add fallback fields for UI compatibility
          const mapped = data.map((order: any) => {
            let items = order.items;
            if (typeof items === "string") {
              try { items = JSON.parse(items); } catch { items = []; }
            }
            return {
              ...order,
              userId: order.userId,
              date: order.createdAt ? order.createdAt.slice(0, 10) : "-",
              status: order.status,
              total: order.total,
              shippingFee: order.shippingFee,
              itemsCount: Array.isArray(items) ? items.length : 0,
              address: order.address || "-",
              items,
            };
          });
          // Fetch Discord IDs for all unique userIds
          const userIds = Array.from(new Set(mapped.map((o: any) => o.userId)));
          let userMap: Record<string, string> = {};
          if (userIds.length > 0) {
            const userRes = await fetch("http://localhost:3000/api/users/batch", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ userIds })
            });
            if (userRes.ok) {
              const users = await userRes.json();
              userMap = users.reduce((acc: Record<string, string>, u: any) => {
                acc[u.id] = u.discordUsername;
                return acc;
              }, {});
            }
          }
          // Attach discordUsername to each order for display
          setOrders(mapped.map((order: any) => ({
            ...order,
            customer: userMap[order.userId] || order.userId,
          })));
        } else {
          setOrders([]);
        }
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndUsers();
  }, []);


  // Map backend status to user-friendly label and color
  const statusMap: Record<string, { label: string; color: string }> = {
    PROCESSING: { label: "Awaiting merchant confirmation", color: "bg-yellow-500" },
    WAITING_FOR_PAYMENT: { label: "Awaiting payment", color: "bg-orange-500" },
    PAID: { label: "Paid", color: "bg-blue-500" },
    SHIPPED: { label: "Shipped", color: "bg-purple-500" },
    DELIVERED: { label: "Delivered", color: "bg-green-500" },
    CANCELED: { label: "Cancelled", color: "bg-red-500" },
  };
  const getStatusColor = (status: string) => statusMap[status]?.color || "bg-gray-500";
  const getStatusLabel = (status: string) => statusMap[status]?.label || status;


  // Map UI filter value to backend status
  const filterMap: Record<string, string> = {
    all: "all",
    "Awaiting merchant confirmation": "PROCESSING",
    "Awaiting payment": "WAITING_FOR_PAYMENT",
    Paid: "PAID",
    Shipped: "SHIPPED",
    Delivered: "DELIVERED",
    Cancelled: "CANCELED",
  };
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === filterMap[statusFilter];
    return matchesSearch && matchesStatus;
  });

  const handleUpdateShippingFee = (orderId: string) => {
    // TODO: Implement backend update logic
    setSelectedOrder(null);
    setShippingFee("");
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // TODO: Implement backend update logic
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



        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID or Customer..."
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
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No orders found.</TableCell>
                    </TableRow>
                  ) : filteredOrders.map((order) => (
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
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.itemsCount}</TableCell>
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
                          
                          {order.status === "PROCESSING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/orders/${order.id}`)}
                              title="Edit order details"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}

                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PROCESSING">Awaiting Confirmation</SelectItem>
                                  <SelectItem value="WAITING_FOR_PAYMENT">Awaiting Payment</SelectItem>
                                  <SelectItem value="PAID">Paid</SelectItem>
                                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                                  <SelectItem value="CANCELED">Cancelled</SelectItem>
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