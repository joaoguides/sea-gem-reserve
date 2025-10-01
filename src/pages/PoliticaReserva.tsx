import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PoliticaReserva = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Política de Reserva</h1>
          
          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Condições de Reserva</h2>
              <p>
                A reserva de embarcações é realizada mediante o pagamento de um sinal, que pode ser:
              </p>
              <ul>
                <li><strong>Fixo:</strong> Valor predefinido por produto</li>
                <li><strong>Percentual:</strong> Porcentagem do valor total da embarcação (mínimo aplicável)</li>
              </ul>

              <h2>2. Bloqueio da Embarcação</h2>
              <p>
                Após confirmação do pagamento do sinal, a embarcação fica bloqueada por 7 dias (período configurável), 
                impedindo que outros clientes realizem a compra durante este período.
              </p>

              <h2>3. Política de Cancelamento</h2>
              <ul>
                <li><strong>Até 7 dias:</strong> Reembolso de 100% do valor do sinal</li>
                <li><strong>Após 7 dias:</strong> Reembolso parcial com retenção de taxa administrativa</li>
              </ul>

              <h2>4. Próximos Passos</h2>
              <p>
                Após a reserva, nossa equipe entrará em contato para:
              </p>
              <ul>
                <li>Agendar visita técnica e test drive</li>
                <li>Análise de documentação</li>
                <li>Apresentação de opções de financiamento (se aplicável)</li>
                <li>Vistoria da embarcação</li>
              </ul>

              <h2>5. Importante</h2>
              <p>
                A reserva não garante aprovação automática de crédito e está sujeita a vistoria 
                e análise de documentação. Em caso de reprovação não atribuível ao cliente, 
                o sinal será reembolsado integralmente.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaReserva;
