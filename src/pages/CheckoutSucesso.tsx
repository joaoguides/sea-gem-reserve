import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const CheckoutSucesso = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Clear cart
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Pedido Realizado!</h1>
              <p className="text-muted-foreground mb-6">
                Seu pedido #{orderId?.slice(0, 8)} foi criado com sucesso.
                Você receberá um e-mail com as instruções de pagamento.
              </p>
              <div className="space-y-3">
                <Link to="/conta" className="block">
                  <Button className="w-full">Ver Meus Pedidos</Button>
                </Link>
                <Link to="/produtos" className="block">
                  <Button variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSucesso;
