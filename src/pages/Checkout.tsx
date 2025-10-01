// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Você precisa estar logado para finalizar a compra",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        setUser(user);
      }
    });

    const saved = localStorage.getItem("cart");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, [navigate, toast]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    if (!acceptedTerms) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos para continuar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          status: "pending",
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        item_type: item.type,
        ref_id: item.type === "reservation" ? item.product_id : item.id,
        qty: item.quantity || 1,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create reservations if any
      const reservations = cartItems
        .filter((item) => item.type === "reservation")
        .map((item) => ({
          user_id: user.id,
          product_id: item.product_id,
          mode: item.mode,
          amount: item.price,
          status: "pending",
        }));

      if (reservations.length > 0) {
        const { error: resError } = await supabase
          .from("reservations")
          .insert(reservations);

        if (resError) throw resError;
      }

      // Clear cart
      localStorage.removeItem("cart");

      toast({
        title: "Pedido criado!",
        description: "Seu pedido foi criado com sucesso. Aguardando pagamento.",
      });

      navigate(`/checkout/sucesso?order_id=${order.id}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar pedido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Forms */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Comprador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input defaultValue={user.user_metadata?.full_name || ""} />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input defaultValue={user.email} disabled />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input placeholder="(00) 00000-0000" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={paymentMethod === "pix" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setPaymentMethod("pix")}
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Pix
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Cartão de Crédito
                  </Button>
                </CardContent>
              </Card>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm leading-none">
                  Aceito a{" "}
                  <a href="/politica-de-reserva" target="_blank" className="text-primary underline">
                    Política de Reserva
                  </a>
                  {" "}e os{" "}
                  <a href="/termos" target="_blank" className="text-primary underline">
                    Termos de Uso
                  </a>
                </label>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name}{" "}
                        {item.type === "accessory" && item.quantity > 1 && `x${item.quantity}`}
                      </span>
                      <span>R$ {(item.price * (item.quantity || 1)).toLocaleString("pt-BR")}</span>
                    </div>
                  ))}

                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toLocaleString("pt-BR")}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading || !acceptedTerms}
                  >
                    {loading ? "Processando..." : "Confirmar Pagamento"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
