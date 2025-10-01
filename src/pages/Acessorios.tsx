import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { useDebounce } from "@/hooks/useDebounce";

type Accessory = Database['public']['Tables']['accessories']['Row'];

const Acessorios = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Debounce search to avoid excessive queries
  const debouncedSearch = useDebounce(search, 300);

  const { data: accessories, isLoading } = useQuery<Accessory[]>({
    queryKey: ["accessories", debouncedSearch, sortBy],
    queryFn: async () => {
      console.log("🔍 [Acessórios] Query Params:", {
        search: debouncedSearch,
        sortBy,
        timestamp: new Date().toISOString()
      });

      let query = supabase.from("accessories").select("*");

      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      switch (sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        default:
          query = query.order("name", { ascending: true });
      }

      const { data, error } = await query;
      
      console.log("✅ [Acessórios] Supabase Response:", {
        count: data?.length || 0,
        error: error?.message,
        sample: data?.[0],
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error("❌ [Acessórios] Query Error:", error);
        toast({
          title: "Erro ao carregar acessórios",
          description: error.message || "Tente novamente mais tarde",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
  });

  const addToCart = (accessory: Accessory) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      type: "accessory",
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      quantity: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    
    toast({
      title: "Adicionado ao carrinho",
      description: `${accessory.name} foi adicionado ao seu carrinho`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Acessórios</h1>
          <p className="text-muted-foreground mb-8">
            Complemente sua embarcação com nossos acessórios premium
          </p>

          {/* Filters */}
          <div className="bg-card rounded-lg shadow-luxury-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar acessórios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                  <SelectItem value="price_desc">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4" />
                  <div className="bg-muted rounded h-4 w-3/4 mb-2" />
                  <div className="bg-muted rounded h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {accessories?.map((accessory) => (
                <Card key={accessory.id}>
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{accessory.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">
                      R$ {accessory.price.toLocaleString("pt-BR")}
                    </p>
                    {accessory.stock !== null && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Estoque: {accessory.stock} unidades
                      </p>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => addToCart(accessory)}
                      disabled={accessory.stock === 0}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Acessorios;
