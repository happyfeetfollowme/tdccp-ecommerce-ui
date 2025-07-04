import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 199,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isOnSale: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 299,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Wearables",
    rating: 4.6,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Minimalist Desk Lamp",
    price: 89,
    originalPrice: 129,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "Home & Living",
    rating: 4.5,
    reviews: 56,
    isOnSale: true,
  },
  {
    id: "4",
    name: "Leather Messenger Bag",
    price: 159,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Accessories",
    rating: 4.7,
    reviews: 203,
  },
  {
    id: "5",
    name: "Organic Coffee Beans",
    price: 24,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "Food & Beverage",
    rating: 4.9,
    reviews: 412,
    isNew: true,
  },
  {
    id: "6",
    name: "Ceramic Plant Pot Set",
    price: 45,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
    category: "Home & Living",
    rating: 4.4,
    reviews: 78,
    isOnSale: true,
  },
];

const ProductGrid = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine quality, 
            style, and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="animate-fade-in">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;