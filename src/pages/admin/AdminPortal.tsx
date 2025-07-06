import { useState } from "react";
import Header from "@/components/Header";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";

const SIDEBAR_ITEMS = [
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
];

export default function AdminPortal() {
  const [active, setActive] = useState("orders");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-card border-r flex flex-col py-8 px-4">
          <h2 className="text-xl font-bold mb-8">Admin Portal</h2>
          <nav className="flex flex-col gap-2">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`text-left px-4 py-2 rounded font-medium transition-colors ${
                  active === item.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {active === "orders" && <AdminOrders />}
          {active === "products" && <AdminProducts />}
        </main>
      </div>
    </div>
  );
}
