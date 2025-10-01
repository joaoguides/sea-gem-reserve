import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Product = Database['public']['Tables']['products']['Row'];

interface ReservaModalProps {
  product: Product;
  onClose: () => void;
}

const ReservaModal = ({ product, onClose }: ReservaModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"fixed" | "percent">("fixed");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const depositFixed = Number(product.deposit_fixed_amount || 2000);
  const depositPercent = Number(product.deposit_percent || 0.02);
  const minDeposit = Number(product.min_deposit_amount || 1000);

  const calculatedAmount = mode === "fixed" 
    ? depositFixed 
    : Math.max(Number(product.price) * depositPercent, minDeposit);

  const handleReserve = () => {
    if (!acceptedTerms) {
      toast({
        title: "Atenção",
        description: "Você precisa aceitar os termos para continuar",
        variant: "destructive",
      });
      return;
    }

    // Add to cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      type: "reservation",
      id: product.id,
      name: product.name,
      price: calculatedAmount,
      mode,
      product_id: product.id,
    });
    localStorage.setItem("cart", JSON.stringify(cart));

    toast({
      title: "Reserva adicionada ao carrinho",
      description: "Finalize sua compra no carrinho",
    });

    onClose();
    navigate("/carrinho");
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar {product.name}</DialogTitle>
          <DialogDescription>
            Escolha o valor do sinal e forma de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deposit Mode */}
          {product.deposit_mode === "both" && (
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Valor do Sinal
              </Label>
              <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex-1 cursor-pointer">
                    <div className="font-medium">Valor Fixo</div>
                    <div className="text-sm text-muted-foreground">
                      R$ {depositFixed.toLocaleString('pt-BR')}
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="percent" id="percent" />
                  <Label htmlFor="percent" className="flex-1 cursor-pointer">
                    <div className="font-medium">Percentual</div>
                    <div className="text-sm text-muted-foreground">
                      {(depositPercent * 100).toFixed(0)}% = R$ {(Number(product.price) * depositPercent).toLocaleString('pt-BR')}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Forma de Pagamento
            </Label>
            <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-1 cursor-pointer flex items-center gap-3">
                  <QrCode className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Pix</div>
                    <div className="text-sm text-muted-foreground">Aprovação imediata</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Cartão de Crédito</div>
                    <div className="text-sm text-muted-foreground">Parcelamento disponível</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Total */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor do Sinal:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {calculatedAmount.toLocaleString('pt-BR')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Este valor reserva a embarcação por 7 dias
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
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

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleReserve} className="flex-1">
              Continuar para Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservaModal;
