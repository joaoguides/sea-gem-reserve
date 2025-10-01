import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona o processo de reserva?",
      answer: "Você escolhe o modelo, paga um sinal (fixo ou percentual) e a embarcação fica reservada por 7 dias. Nossa equipe entrará em contato para agendar visita e test drive."
    },
    {
      question: "Qual o prazo de entrega?",
      answer: "Para embarcações em estoque, a entrega pode ocorrer em até 15 dias úteis após a aprovação de toda documentação. Modelos sob encomenda podem levar de 60 a 180 dias."
    },
    {
      question: "Vocês oferecem financiamento?",
      answer: "Sim! Trabalhamos com os principais bancos e financeiras do mercado náutico. Nossa equipe comercial pode apresentar as melhores opções para o seu perfil."
    },
    {
      question: "Posso fazer test drive?",
      answer: "Sim! Após a reserva, agendamos um test drive em nossa marina. É necessário apresentar habilitação náutica válida e documento com foto."
    },
    {
      question: "Qual a garantia das embarcações?",
      answer: "Embarcações novas têm garantia de fábrica de 1 ano. Seminovos certificados têm garantia de 6 meses para motor e estrutura."
    },
    {
      question: "Aceito minha embarcação usada como parte do pagamento?",
      answer: "Sim! Fazemos avaliação de embarcações usadas para troca. Nossa equipe agenda vistoria e apresenta proposta de avaliação."
    },
    {
      question: "Como funciona a documentação?",
      answer: "Nossa equipe cuida de toda a documentação junto à Marinha e órgãos competentes. O processo leva em média 30 dias após a compra."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos Pix, transferência bancária, cartão de crédito parcelado e financiamento. O sinal da reserva pode ser pago via Pix ou cartão."
    },
    {
      question: "Posso cancelar a reserva?",
      answer: "Sim. Cancelamentos em até 7 dias têm reembolso integral. Após esse período, há retenção de taxa administrativa conforme nossa Política de Reserva."
    },
    {
      question: "Vocês fazem manutenção?",
      answer: "Sim! Temos oficina autorizada com técnicos especializados. Oferecemos planos de manutenção preventiva e corretiva."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-muted-foreground">
              Encontre respostas para as dúvidas mais comuns sobre nossas embarcações e serviços
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava?
            </p>
            <a href="#contato" className="text-primary hover:underline">
              Entre em contato conosco
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
