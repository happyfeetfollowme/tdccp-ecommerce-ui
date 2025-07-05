import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = async (navigateTo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await fetch("http://localhost:3000/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.imageUrl || '/placeholder.svg'
        }),
      });

      if (response.ok) {
        // Fetch the updated cart and set it in localStorage
        const cartResponse = await fetch("http://localhost:3000/api/cart", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          localStorage.setItem("cart", JSON.stringify(cartData.items || []));
          window.dispatchEvent(new Event("cart-updated"));
        }
        const addedItem = await response.json();
        console.log(`Added ${quantity} items to cart`);
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.name} has been added to your cart.`,
        });
        if (navigateTo) {
          navigate(navigateTo);
        }
        return addedItem;
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart:", errorData.message || "Unknown error");
        toast({
          variant: "destructive",
          title: "Failed to add to cart",
          description: errorData.message || "There was an issue adding the item to your cart.",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }
    return null;
  };

  const handleAddToCart = () => {
    addToCart("/cart");
  };

  const handleBuyNow = async () => {
    const addedItem = await addToCart(null);
    if (addedItem) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[500px] rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container text-center py-20">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-muted-foreground">The product you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <img 
              src={product.imageUrl || '/placeholder.svg'} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
            {product.isOnSale && <Badge className="absolute top-4 left-4">Sale</Badge>}
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase">{product.category}</p>
              <h1 className="text-4xl font-bold">{product.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-muted-foreground"}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Quantity:</p>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
            </div>

            {product.stock > 0 ? (
              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="flex-1" onClick={handleBuyNow} disabled={product.stock === 0}>
                  Buy Now
                </Button>
              </div>
            ) : (
              <Button size="lg" className="flex-1" disabled>
                Out of Stock
              </Button>
            )}

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
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;