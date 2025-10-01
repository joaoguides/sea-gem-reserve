import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Termos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
          
          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar este site, você aceita e concorda em cumprir estes Termos de Uso.
                Se você não concordar com estes termos, não use este site.
              </p>

              <h2>2. Uso do Site</h2>
              <p>
                Este site é fornecido para fins informativos e comerciais. Você concorda em usar 
                o site apenas para fins legais e de maneira que não infrinja os direitos de terceiros.
              </p>

              <h2>3. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo textos, gráficos, logos, imagens e software, 
                é propriedade da Luxury Boats ou de seus fornecedores e está protegido por leis 
                de direitos autorais.
              </p>

              <h2>4. Informações de Produtos</h2>
              <p>
                Fazemos todos os esforços para garantir que as informações sobre produtos sejam 
                precisas. No entanto, não garantimos que todas as descrições, imagens e especificações 
                estejam completamente atualizadas ou livres de erros.
              </p>

              <h2>5. Limitação de Responsabilidade</h2>
              <p>
                A Luxury Boats não será responsável por quaisquer danos diretos, indiretos, 
                incidentais ou consequenciais decorrentes do uso ou incapacidade de usar este site.
              </p>

              <h2>6. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no site.
              </p>

              <h2>7. Contato</h2>
              <p>
                Para questões sobre estes Termos de Uso, entre em contato conosco através do 
                e-mail contato@luxuryboats.com.br ou telefone (21) 3000-0000.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Termos;
