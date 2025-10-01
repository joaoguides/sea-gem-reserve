import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Guia Completo: Como Escolher Seu Primeiro Iate",
      excerpt: "Descubra os principais fatores a considerar na hora de adquirir sua primeira embarcação de luxo.",
      date: "15 de Setembro, 2024",
      author: "Marina Santos",
      image: "/placeholder.svg",
      category: "Guias"
    },
    {
      id: 2,
      title: "Manutenção Náutica: 10 Dicas Essenciais",
      excerpt: "Mantenha sua embarcação em perfeito estado com essas práticas recomendadas por especialistas.",
      date: "10 de Setembro, 2024",
      author: "Carlos Mendes",
      image: "/placeholder.svg",
      category: "Manutenção"
    },
    {
      id: 3,
      title: "Os Melhores Destinos Náuticos do Brasil",
      excerpt: "Explore as rotas mais incríveis para navegar em águas brasileiras nesta temporada.",
      date: "5 de Setembro, 2024",
      author: "Julia Costa",
      image: "/placeholder.svg",
      category: "Destinos"
    },
    {
      id: 4,
      title: "Tendências em Iates de Luxo para 2024",
      excerpt: "Conheça as novidades tecnológicas e de design que estão revolucionando o mercado náutico.",
      date: "1 de Setembro, 2024",
      author: "Roberto Silva",
      image: "/placeholder.svg",
      category: "Tendências"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog <span className="text-gradient-ocean">Azure Yachts</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notícias, dicas e insights sobre o mundo náutico de luxo
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-luxury transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State for Future */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Novos artigos em breve...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
