import ProductCard from "./ProductCard";
import boat1 from "@/assets/boat-1.jpg";
import boat2 from "@/assets/boat-2.jpg";
import boat3 from "@/assets/boat-3.jpg";
import boat4 from "@/assets/boat-4.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredBoats = [
  {
    id: "1",
    image: boat1,
    title: "Azimut Atlantis 43",
    price: "R$ 2.450.000",
    year: "2025",
    type: "Lancha Esportiva",
    length: "13.2m",
    motorization: "2x 370HP",
    badge: "Lançamento",
    isNew: true,
  },
  {
    id: "2",
    image: boat2,
    title: "Bavaria Cruiser 51",
    price: "R$ 1.890.000",
    year: "2024",
    type: "Veleiro",
    length: "15.5m",
    motorization: "1x 75HP",
    isNew: true,
  },
  {
    id: "3",
    image: boat3,
    title: "Sea-Doo RXP-X 300",
    price: "R$ 89.900",
    year: "2025",
    type: "Jet Ski",
    length: "3.5m",
    motorization: "300HP",
    badge: "Best-Seller",
    isNew: true,
  },
  {
    id: "4",
    image: boat4,
    title: "Ferretti Yachts 450",
    price: "R$ 3.200.000",
    year: "2024",
    type: "Iate",
    length: "13.8m",
    motorization: "2x 435HP",
    badge: "Promoção",
    isNew: false,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">Destaques</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Modelos em <span className="text-gradient-ocean">Destaque</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Conheça nossos lançamentos exclusivos, best-sellers e promoções especiais.
            Reserve agora com sinal facilitado.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBoats.map((boat) => (
            <ProductCard key={boat.id} {...boat} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="group">
            Ver Todos os Modelos
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
