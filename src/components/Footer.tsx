import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              ModernStore
            </h3>
            <p className="text-primary-foreground/80">
              Your destination for premium products and exceptional shopping experiences.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Stay Updated</h4>
            <p className="text-primary-foreground/80 text-sm">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-primary-foreground/60"
              />
              <Button variant="hero" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 ModernStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;