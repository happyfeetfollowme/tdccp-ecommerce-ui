import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, ShoppingCart, Shield, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAdminStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    if (e.key === "Enter") {
      if (searchTerm.trim() !== "") {
        navigate(`/?search=${searchTerm}`);
      } else {
        navigate("/");
      }
    }
  };

  const commonNavLinks = (
    <>
      {localStorage.getItem("token") ? (
        <>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => { navigate("/admin"); setIsMobileMenuOpen(false); }} title="Admin Portal" className="w-full justify-start md:w-auto md:justify-center">
              <Shield className="h-4 w-4 text-yellow-500 mr-2 md:mr-0" /> <span className="md:hidden">Admin Portal</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }} className="w-full justify-start md:w-auto md:justify-center">
            <User className="h-4 w-4 mr-2 md:mr-0" /> <span className="md:hidden">Profile</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative w-full justify-start md:w-auto md:justify-center" onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}>
            <ShoppingCart className="h-4 w-4 mr-2 md:mr-0" /> <span className="md:hidden">Cart</span>
            {cartCount > 0 && (
              <Badge className="absolute top-0 right-0 md:top-0 md:right-0 h-5 w-5 rounded-full p-0 text-xs bg-accent">
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("token"); navigate("/login"); setIsMobileMenuOpen(false); }} className="w-full justify-start md:w-auto md:justify-center">
            Logout
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => { window.location.href = "http://localhost:3000/api/auth/discord"; setIsMobileMenuOpen(false); }} className="w-full justify-start md:w-auto md:justify-center">
          Login with Discord
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent">
            tdccp
          </h1>
        </Link>

        {/* Search - hidden on small screens, flex-1 on md and up */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 transition-all duration-300 focus:shadow-card w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {commonNavLinks}
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 sm:w-1/2">
              <div className="flex flex-col space-y-4 p-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 transition-all duration-300 focus:shadow-card w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  />
                </div>
                <nav className="flex flex-col space-y-2">
                  {commonNavLinks}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;