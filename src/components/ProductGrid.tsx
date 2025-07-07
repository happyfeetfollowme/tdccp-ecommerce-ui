import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const query = useQuery();
  const search = query.get("search") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/products?page=${page}&pageSize=10&search=${search}`);
      const data = await response.json();
      setProducts((prev) => page === 1 ? data.products : [...prev, ...data.products]);
      setHasMore(data.products.length > 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleObserver = useCallback((entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Featured Products</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine quality, 
            style, and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        )}

        <div ref={loader} />

        {!loading && !hasMore && (
          <div className="text-center mt-16">
            <p className="text-muted-foreground">You've reached the end.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;