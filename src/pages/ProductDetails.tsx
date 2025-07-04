import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock product data - in real app this would come from API
const mockProduct = {
  id: "1",
  name: "Premium Wireless Headphones",
  price: 199,
  originalPrice: 299,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"
  ],
  category: "Electronics",
  rating: 4.8,
  reviews: 124,
  isNew: true,
  isOnSale: true,
  description: "Experience superior sound quality with these premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort design.",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life", 
    "Wireless Bluetooth 5.0",
    "Premium comfort padding",
    "Quick charge - 15 min for 3 hours"
  ],
  inStock: true,
  stockCount: 15
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} items to cart`);
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{mockProduct.category}</Badge>
                {mockProduct.isNew && <Badge variant="default">New</Badge>}
                {mockProduct.isOnSale && <Badge className="bg-destructive">Sale</Badge>}
              </div>
              
              <h1 className="text-3xl font-bold">{mockProduct.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(mockProduct.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {mockProduct.rating} ({mockProduct.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${mockProduct.price}</span>
                {mockProduct.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${mockProduct.originalPrice}
                  </span>
                )}
                {mockProduct.isOnSale && (
                  <Badge variant="destructive">
                    {Math.round(((mockProduct.originalPrice! - mockProduct.price) / mockProduct.originalPrice!) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{mockProduct.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Key Features</h3>
              <ul className="space-y-2">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {mockProduct.inStock && (
                  <span className="text-sm text-muted-foreground">
                    {mockProduct.stockCount} in stock
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="flex-1" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;