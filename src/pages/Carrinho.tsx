// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  type: "accessory" | "reservation";
  id: string;
  name: string;
  price: number;
  quantity?: number;
  mode?: "fixed" | "percent";
  product_id?: string;
}

const Carrinho = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const removeItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    saveCart(newItems);
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho",
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...cartItems];
    if (newItems[index].type === "accessory") {
      const newQty = (newItems[index].quantity || 1) + delta;
      if (newQty > 0) {
        newItems[index].quantity = newQty;
        saveCart(newItems);
      }
    }
  };

  const subtotalAccessories = cartItems
    .filter((item) => item.type === "accessory")
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const subtotalReservations = cartItems
    .filter((item) => item.type === "reservation")
    .reduce((sum, item) => sum + item.price, 0);

  const total = subtotalAccessories + subtotalReservations;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Carrinho</h1>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
                <Button onClick={() => navigate("/produtos")}>
                  Ver Catálogo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Items */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 pb-4 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.type === "reservation"
                              ? `Sinal - ${item.mode === "fixed" ? "Fixo" : "Percentual"}`
                              : "Acessório"}
                          </p>
                        </div>

                        {item.type === "accessory" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(index, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity || 1}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(index, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {(item.price * (item.quantity || 1)).toLocaleString("pt-BR")}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {subtotalAccessories > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Acessórios:</span>
                        <span>R$ {subtotalAccessories.toLocaleString("pt-BR")}</span>
                      </div>
                    )}
                    {subtotalReservations > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reservas (Sinal):</span>
                        <span>R$ {subtotalReservations.toLocaleString("pt-BR")}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>R$ {total.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Finalizar Compra
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Carrinho;
