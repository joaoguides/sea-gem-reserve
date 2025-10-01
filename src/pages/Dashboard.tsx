import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductList } from "@/components/admin/ProductList";
import { OrdersList } from "@/components/admin/OrdersList";
import { useToast } from "@/hooks/use-toast";
import { Plus, Package, ShoppingCart, FileText } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || data?.role !== "admin") {
      navigate("/");
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  };

  const loadData = async () => {
    // Load products
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsData) setProducts(productsData);

    // Load orders with profiles
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, profiles(full_name, phone)")
      .order("created_at", { ascending: false });

    if (ordersData) setOrders(ordersData);

    // Calculate stats
    const productCount = productsData?.length || 0;
    const orderCount = ordersData?.length || 0;
    const revenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({ products: productCount, orders: orderCount, revenue });
  };

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({ title: "Produto atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert(data);

        if (error) throw error;

        toast({ title: "Produto criado com sucesso!" });
      }

      setShowProductForm(false);
      setEditingProduct(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Produto excluído com sucesso!" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard Administrativo</h1>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.products}</div>
                    <p className="text-xs text-muted-foreground">Embarcações cadastradas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.orders}</div>
                    <p className="text-xs text-muted-foreground">Total de pedidos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {stats.revenue.toLocaleString("pt-BR")}</div>
                    <p className="text-xs text-muted-foreground">Total processado</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              {!showProductForm ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Produtos</h2>
                    <Button onClick={() => setShowProductForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <ProductList
                        products={products}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                      {editingProduct ? "Editar Produto" : "Novo Produto"}
                    </h2>
                  </div>
                  <ProductForm
                    initialData={editingProduct}
                    onSubmit={handleSaveProduct}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Pedidos</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <OrdersList
                    orders={orders}
                    onViewDetails={(order) => console.log("View order:", order)}
                  />
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

export default Dashboard;
