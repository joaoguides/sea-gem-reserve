import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(url, sort)
        `)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(15);

      if (error) throw error;
      
      return data.map((product: any) => ({
        ...product,
        image: product.product_images?.[0]?.url || "boat-1.jpg",
      }));
    },
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4" />
                <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                <div className="bg-muted rounded h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">Destaques</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Modelos em <span className="text-gradient-ocean">Destaque</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Conheça nossos lançamentos exclusivos, best-sellers e promoções especiais.
            Reserve agora com sinal facilitado.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              image={product.image}
              title={product.name}
              price={product.price}
              year={product.year}
              type={product.type}
              length={product.length_m}
              motorization={product.engine}
              badge={product.status === "novo" ? "Novo" : "Seminovo"}
              isNew={product.status === "novo"}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="group" onClick={() => window.location.href = '/produtos'}>
            Ver Todos os Modelos
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
