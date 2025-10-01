import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Heart, FileText, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type Reservation = Database['public']['Tables']['reservations']['Row'] & {
  products?: Database['public']['Tables']['products']['Row'];
};

type Favorite = Database['public']['Tables']['favorites']['Row'] & {
  products?: Database['public']['Tables']['products']['Row'];
};

const Conta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  const { data: reservations } = useQuery({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          products(name, slug, price)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          products(name, slug, price, product_images(url))
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Minha Conta</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <Tabs defaultValue="reservations" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reservations">
                <Package className="h-4 w-4 mr-2" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Reservas</CardTitle>
                  <CardDescription>
                    Acompanhe suas reservas e pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reservations && reservations.length > 0 ? (
                    <div className="space-y-4">
                      {reservations.map((reservation: any) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold">{reservation.products.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              R$ {reservation.amount.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Status: {reservation.status}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Você ainda não tem reservas
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favoritos</CardTitle>
                  <CardDescription>
                    Embarcações que você salvou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((favorite: any) => (
                        <div
                          key={favorite.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <img
                            src={favorite.products.product_images?.[0]?.url || "/placeholder.svg"}
                            alt={favorite.products.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold mb-1">{favorite.products.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              R$ {favorite.products.price.toLocaleString('pt-BR')}
                            </p>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => navigate(`/produtos/${favorite.products.slug}`)}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Você ainda não tem favoritos
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome</label>
                      <p className="text-muted-foreground">
                        {user.user_metadata?.full_name || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">E-mail</label>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline">
                      Editar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Conta;
