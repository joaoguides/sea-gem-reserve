import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      name: "",
      slug: "",
      type: "lancha",
      status: "disponivel",
      year: new Date().getFullYear(),
      price: 0,
      location: "",
      featured: false,
      deposit_mode: "both",
      deposit_fixed_amount: 0,
      deposit_percent: 0,
    },
  });

  const depositMode = watch("deposit_mode");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome *</Label>
              <Input {...register("name", { required: true })} />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input {...register("slug", { required: true })} placeholder="nome-do-produto" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Tipo *</Label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={initialData?.type || "lancha"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lancha">Lancha</SelectItem>
                  <SelectItem value="iate">Iate</SelectItem>
                  <SelectItem value="veleiro">Veleiro</SelectItem>
                  <SelectItem value="jet-ski">Jet Ski</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status *</Label>
              <Select onValueChange={(value) => setValue("status", value)} defaultValue={initialData?.status || "disponivel"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ano *</Label>
              <Input type="number" {...register("year", { required: true, valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço (R$) *</Label>
              <Input type="number" step="0.01" {...register("price", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <Label>Localização *</Label>
              <Input {...register("location", { required: true })} placeholder="Cidade, Estado" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured"
              onCheckedChange={(checked) => setValue("featured", checked as boolean)}
              defaultChecked={initialData?.featured}
            />
            <Label htmlFor="featured">Produto em Destaque</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especificações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Comprimento (m) *</Label>
              <Input type="number" step="0.01" {...register("length_m", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <Label>Largura (m)</Label>
              <Input type="number" step="0.01" {...register("beam_m", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Calado (m)</Label>
              <Input type="number" step="0.01" {...register("draft_m", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Capacidade (pessoas)</Label>
              <Input type="number" {...register("capacity_people", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Autonomia (nm)</Label>
              <Input type="number" {...register("range_nm", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Horas de Motor</Label>
              <Input type="number" {...register("engine_hours", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Material</Label>
              <Input {...register("material")} placeholder="Ex: Fibra de vidro" />
            </div>
            <div>
              <Label>Motor</Label>
              <Input {...register("engine")} placeholder="Ex: Volvo Penta" />
            </div>
            <div>
              <Label>Combustível</Label>
              <Input {...register("fuel")} placeholder="Ex: Diesel" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Política de Sinal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Modo de Sinal</Label>
            <Select onValueChange={(value) => setValue("deposit_mode", value)} defaultValue={initialData?.deposit_mode || "both"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Apenas Valor Fixo</SelectItem>
                <SelectItem value="percent">Apenas Percentual</SelectItem>
                <SelectItem value="both">Valor Fixo ou Percentual</SelectItem>
                <SelectItem value="none">Sem Opção de Sinal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(depositMode === "fixed" || depositMode === "both") && (
            <div>
              <Label>Valor Fixo do Sinal (R$)</Label>
              <Input type="number" step="0.01" {...register("deposit_fixed_amount", { valueAsNumber: true })} />
            </div>
          )}

          {(depositMode === "percent" || depositMode === "both") && (
            <div>
              <Label>Percentual do Sinal (%)</Label>
              <Input type="number" step="0.01" {...register("deposit_percent", { valueAsNumber: true })} />
            </div>
          )}

          <div>
            <Label>Período de Reserva (dias)</Label>
            <Input type="number" {...register("hold_period_days", { valueAsNumber: true })} defaultValue={7} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Atualizar" : "Criar"} Produto
        </Button>
      </div>
    </form>
  );
};
