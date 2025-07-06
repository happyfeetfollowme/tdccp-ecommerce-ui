import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, ShoppingCart, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    }
    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim() !== '') {
        navigate(`/?search=${searchTerm}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent">
            tdccp
          </h1>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 transition-all duration-300 focus:shadow-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          
          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {localStorage.getItem("token") ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
                    title="Admin Portal"
                  >
                    <Shield className="h-4 w-4 text-yellow-500" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}> 
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")}> 
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-accent">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => {
                window.location.href = "http://localhost:3000/api/auth/discord";
              }}>
                Login with Discord
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;