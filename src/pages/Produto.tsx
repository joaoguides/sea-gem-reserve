import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, Share2, Download, Calendar, MessageCircle, 
  Anchor, Gauge, Fuel, Users, Ruler, Waves 
} from "lucide-react";
import { useState, useEffect } from "react";
import ReservaModal from "@/components/ReservaModal";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Product = Database['public']['Tables']['products']['Row'] & {
  product_images?: Database['public']['Tables']['product_images']['Row'][];
  product_features?: Database['public']['Tables']['product_features']['Row'][];
};

const Produto = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
      }
    });
  }, []);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images(url, sort),
          product_features(group_name, label)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });

  useEffect(() => {
    if (user && product) {
      supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsFavorited(!!data);
        });
    }
  }, [user, product]);

  const toggleFavorite = async () => {
    if (!user || !product) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para favoritar",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);
        setIsFavorited(false);
        toast({ title: "Removido dos favoritos" });
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, product_id: product.id });
        setIsFavorited(true);
        toast({ title: "Adicionado aos favoritos" });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mb-4 mx-auto" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/produtos">
            <Button>Voltar ao Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.product_images?.sort((a, b) => (a.sort || 0) - (b.sort || 0)) || [];
  const features = product.product_features || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            {" / "}
            <Link to="/produtos" className="hover:text-primary">Produtos</Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Gallery */}
            <div>
              <div className="relative rounded-lg overflow-hidden mb-4 aspect-[4/3]">
                <img
                  src={images[selectedImage]?.url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.status === "novo" && (
                  <Badge className="absolute top-4 left-4 bg-accent">Novo</Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-4 right-4 bg-primary">Destaque</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition-all ${
                      selectedImage === idx ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">{product.type}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                  <p className="text-muted-foreground">{product.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className={isFavorited ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                <p className="text-4xl font-bold text-primary">
                  R$ {product.price.toLocaleString('pt-BR')}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Anchor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ano</p>
                    <p className="font-semibold">{product.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Comprimento</p>
                    <p className="font-semibold">{product.length_m}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Motor</p>
                    <p className="font-semibold">{product.engine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                    <p className="font-semibold">{product.capacity_people} pessoas</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowReservaModal(true)}
                >
                  Reservar com Sinal
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
                {product.brochure_url && (
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Brochura
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="mb-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specs">Ficha Técnica</TabsTrigger>
              <TabsTrigger value="features">Equipamentos</TabsTrigger>
              <TabsTrigger value="description">Descrição</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Dimensões</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Comprimento:</span>
                          <span className="font-medium">{product.length_m}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Boca:</span>
                          <span className="font-medium">{product.beam_m}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Calado:</span>
                          <span className="font-medium">{product.draft_m}m</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Motorização</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Motor:</span>
                          <span className="font-medium">{product.engine}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horas de uso:</span>
                          <span className="font-medium">{product.engine_hours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Combustível:</span>
                          <span className="font-medium capitalize">{product.fuel}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Capacidades</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pessoas:</span>
                          <span className="font-medium">{product.capacity_people}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Autonomia:</span>
                          <span className="font-medium">{product.range_nm} milhas náuticas</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Outros</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="font-medium capitalize">{product.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ano:</span>
                          <span className="font-medium">{product.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {features.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(
                        features.reduce<Record<string, string[]>>((acc, feat) => {
                          const groupName = feat.group_name || 'Outros';
                          if (!acc[groupName]) acc[groupName] = [];
                          if (feat.label) acc[groupName].push(feat.label);
                          return acc;
                        }, {})
                      ).map(([group, items]) => (
                        <div key={group}>
                          <h3 className="font-semibold mb-3">{group}</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum equipamento cadastrado
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.name} é uma embarcação {product.type} de {product.year}, 
                    com {product.length_m}m de comprimento e capacidade para {product.capacity_people} pessoas.
                    Equipada com motor {product.engine}, oferece conforto e performance para 
                    sua navegação.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      
      {showReservaModal && (
        <ReservaModal
          product={product}
          onClose={() => setShowReservaModal(false)}
        />
      )}
    </div>
  );
};

export default Produto;
